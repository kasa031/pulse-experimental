/**
 * OsloScreen - Oslo historie og quiz
 * Viser informasjon om Oslo, gatenavn-historie, og quiz
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import { 
  Card, 
  Text, 
  Button, 
  Chip, 
  ActivityIndicator, 
  TextInput,
  Snackbar,
  Dialog,
  Portal,
  Divider
} from 'react-native-paper';
import { theme, osloBranding } from '../constants/theme';
import { getRandomQuestion, QuizQuestion } from '../constants/osloQuiz';
import { safeError } from '../utils/performance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT, CHIP_MIN_HEIGHT } from '../constants/touchTargets';
import { auth, db } from '../services/firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { analytics } from '../utils/analytics';
import { sanitizeText } from '../utils/validation';

interface StreetHistory {
  id?: string;
  streetName: string;
  description: string;
  images?: string[];
  author: string;
  authorId: string;
  createdAt: Timestamp;
  district?: string;
}

const OsloScreen = () => {
  const { width } = useResponsive();
  const padding = getResponsivePadding(width);
  const [activeTab, setActiveTab] = useState<'quiz' | 'history' | 'facts'>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Street history states
  const [streetHistories, setStreetHistories] = useState<StreetHistory[]>([]);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [newStreetName, setNewStreetName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load initial question
  useEffect(() => {
    loadNewQuestion();
    if (activeTab === 'history') {
      loadStreetHistories();
    }
    analytics.trackPageView('oslo');
  }, [activeTab]);

  const loadNewQuestion = () => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const loadStreetHistories = useCallback(async () => {
    try {
      setLoading(true);
      if (!db) {
        safeError('Firestore ikke tilgjengelig');
        return;
      }

      const historiesRef = collection(db, 'osloStreetHistory');
      const q = query(historiesRef, orderBy('createdAt', 'desc'), limit(20));
      const snapshot = await getDocs(q);
      
      const histories: StreetHistory[] = [];
      snapshot.forEach((doc) => {
        histories.push({ id: doc.id, ...doc.data() } as StreetHistory);
      });
      
      setStreetHistories(histories);
    } catch (error) {
      safeError('Feil ved henting av gatenavn-historie:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      setSnackbarMessage('🎉 Riktig! ' + currentQuestion.explanation);
    } else {
      const correctOption = currentQuestion.options[currentQuestion.correctAnswer];
      setSnackbarMessage(`❌ Feil. Riktig svar: ${correctOption}. ${currentQuestion.explanation}`);
    }
    setSnackbarVisible(true);
    
    analytics.track('quiz_answer', {
      questionId: currentQuestion.id,
      correct: selectedAnswer === currentQuestion.correctAnswer
    });
  };

  const handleNextQuestion = () => {
    loadNewQuestion();
  };

  const handleAddStreetHistory = async () => {
    if (!newStreetName.trim() || !newDescription.trim()) {
      setSnackbarMessage('Vennligst fyll ut både gatenavn og beskrivelse');
      setSnackbarVisible(true);
      return;
    }

    const user = auth?.currentUser;
    if (!user || !db) {
      setSnackbarMessage('Du må være innlogget for å legge til historie');
      setSnackbarVisible(true);
      return;
    }

    try {
      setLoading(true);
      // Sanitize all user input before saving
      const historyData: Omit<StreetHistory, 'id'> = {
        streetName: sanitizeText(newStreetName.trim(), 100),
        description: sanitizeText(newDescription.trim(), 2000),
        district: newDistrict.trim() ? sanitizeText(newDistrict.trim(), 50) : undefined,
        author: sanitizeText(user.displayName || user.email || 'Anonym', 100),
        authorId: user.uid,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'osloStreetHistory'), historyData);
      
      setSnackbarMessage('✅ Gatenavn-historie lagt til!');
      setSnackbarVisible(true);
      setShowAddHistory(false);
      setNewStreetName('');
      setNewDescription('');
      setNewDistrict('');
      
      // Reload histories
      await loadStreetHistories();
      
      analytics.track('street_history_added', {
        streetName: newStreetName
      });
    } catch (error) {
      safeError('Feil ved lagring av gatenavn-historie:', error);
      setSnackbarMessage('Feil ved lagring. Prøv igjen.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === 'history') {
      await loadStreetHistories();
    } else if (activeTab === 'quiz') {
      loadNewQuestion();
    }
    setRefreshing(false);
  }, [activeTab, loadStreetHistories]);

  const renderQuiz = () => (
    <View style={styles.tabContent}>
      {currentQuestion ? (
        <>
          <Card style={styles.quizCard}>
            <Card.Content>
              <View style={styles.scoreContainer}>
                <Text variant="titleMedium" style={styles.scoreText}>
                  Poeng: {score} / {totalQuestions}
                </Text>
                {totalQuestions > 0 && (
                  <Text variant="bodySmall" style={styles.percentageText}>
                    ({Math.round((score / totalQuestions) * 100)}%)
                  </Text>
                )}
              </View>
              
              <Divider style={styles.divider} />
              
              <Text variant="headlineSmall" style={styles.questionText}>
                {currentQuestion.question}
              </Text>
              
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;
                  
                  return (
                    <Button
                      key={index}
                      mode={isSelected ? 'contained' : 'outlined'}
                      onPress={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      style={[
                        styles.optionButton,
                        showCorrect && styles.correctAnswer,
                        showWrong && styles.wrongAnswer
                      ]}
                      buttonColor={
                        showCorrect 
                          ? '#4caf50' 
                          : showWrong 
                          ? '#f44336' 
                          : isSelected 
                          ? osloBranding.colors.primary 
                          : undefined
                      }
                      textColor={
                        showCorrect || showWrong || isSelected
                          ? '#fff'
                          : osloBranding.colors.primary
                      }
                    >
                      {option}
                    </Button>
                  );
                })}
              </View>
              
              {showResult && (
                <View style={styles.explanationContainer}>
                  <Text variant="bodyMedium" style={styles.explanationText}>
                    {currentQuestion.explanation}
                  </Text>
                </View>
              )}
              
              <View style={styles.quizActions}>
                {!showResult ? (
                  <Button
                    mode="contained"
                    onPress={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    style={styles.submitButton}
                    buttonColor={osloBranding.colors.primary}
                  >
                    Send svar
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={handleNextQuestion}
                    style={styles.nextButton}
                    buttonColor={osloBranding.colors.primary}
                    icon="arrow-right"
                  >
                    Neste spørsmål
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoRow}>
                <Icon name="information" size={20} color={osloBranding.colors.primary} />
                <Text variant="bodySmall" style={styles.infoText}>
                  Test din kunnskap om Oslo! Svar på spørsmål og lær mer om byen.
                </Text>
              </View>
            </Card.Content>
          </Card>
        </>
      ) : (
        <ActivityIndicator size="large" style={styles.loader} />
      )}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      <Card style={styles.addCard}>
        <Card.Content>
          <View style={styles.addHeader}>
            <Icon name="map-marker" size={24} color={osloBranding.colors.primary} />
            <Text variant="titleMedium" style={styles.addTitle}>
              Legg til gatenavn-historie
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.addDescription}>
            Del kunnskap om Oslos gater! Legg til historie, bilder og fakta om gatenavn.
          </Text>
          <Button
            mode="outlined"
            onPress={() => setShowAddHistory(true)}
            style={styles.addButton}
            icon="plus"
          >
            Legg til historie
          </Button>
        </Card.Content>
      </Card>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : streetHistories.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Icon name="map-outline" size={48} color="#999" style={styles.emptyIcon} />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Ingen gatenavn-historie ennå
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Vær den første til å legge til historie om en gate i Oslo!
            </Text>
          </Card.Content>
        </Card>
      ) : (
        streetHistories.map((history) => (
          <Card key={history.id} style={styles.historyCard}>
            <Card.Content>
              <View style={styles.historyHeader}>
                <View style={styles.historyHeaderLeft}>
                  <Icon name="road" size={24} color={osloBranding.colors.primary} />
                  <Text variant="titleLarge" style={styles.streetName}>
                    {history.streetName}
                  </Text>
                </View>
                {history.district && (
                  <Chip style={styles.districtChip} textStyle={styles.districtChipText}>
                    {history.district}
                  </Chip>
                )}
              </View>
              
              <Text variant="bodyMedium" style={styles.historyDescription}>
                {history.description}
              </Text>
              
              <View style={styles.historyFooter}>
                <View style={styles.authorInfo}>
                  <Icon name="account" size={16} color="#666" />
                  <Text variant="bodySmall" style={styles.authorText}>
                    {history.author}
                  </Text>
                </View>
                <Text variant="bodySmall" style={styles.dateText}>
                  {history.createdAt?.toDate?.().toLocaleDateString('nb-NO') || 'Ukjent dato'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );

  const renderFacts = () => (
    <View style={styles.tabContent}>
      <Card style={styles.factCard}>
        <Card.Content>
          <View style={styles.factHeader}>
            <Icon name="lightbulb-on" size={32} color={osloBranding.colors.primary} />
            <Text variant="headlineSmall" style={styles.factTitle}>
              Fun Facts om Oslo
            </Text>
          </View>
          
          <View style={styles.factsList}>
            <View style={styles.factItem}>
              <Icon name="map-marker" size={20} color={osloBranding.colors.primary} />
              <View style={styles.factContent}>
                <Text variant="titleSmall" style={styles.factItemTitle}>
                  Korteste gate
                </Text>
                <Text variant="bodyMedium" style={styles.factItemText}>
                  Skjærslibakken i Gamlebyen er Oslos korteste gate med bare 5,2 meter!
                </Text>
              </View>
            </View>
            
            <Divider style={styles.factDivider} />
            
            <View style={styles.factItem}>
              <Icon name="calendar" size={20} color={osloBranding.colors.primary} />
              <View style={styles.factContent}>
                <Text variant="titleSmall" style={styles.factItemTitle}>
                  Grunnlagt
                </Text>
                <Text variant="bodyMedium" style={styles.factItemText}>
                  Oslo ble grunnlagt rundt år 1048 av Harald Hardråde.
                </Text>
              </View>
            </View>
            
            <Divider style={styles.factDivider} />
            
            <View style={styles.factItem}>
              <Icon name="church" size={20} color={osloBranding.colors.primary} />
              <View style={styles.factContent}>
                <Text variant="titleSmall" style={styles.factItemTitle}>
                  Eldste bygning
                </Text>
                <Text variant="bodyMedium" style={styles.factItemText}>
                  Gamle Aker kirke er Oslos eldste bygning, bygget rundt år 1100.
                </Text>
              </View>
            </View>
            
            <Divider style={styles.factDivider} />
            
            <View style={styles.factItem}>
              <Icon name="island" size={20} color={osloBranding.colors.primary} />
              <View style={styles.factContent}>
                <Text variant="titleSmall" style={styles.factItemTitle}>
                  Øyer i Oslofjorden
                </Text>
                <Text variant="bodyMedium" style={styles.factItemText}>
                  Det er over 300 øyer i Oslofjorden, hvorav mange er populære utfartsmål.
                </Text>
              </View>
            </View>
            
            <Divider style={styles.factDivider} />
            
            <View style={styles.factItem}>
              <Icon name="account-group" size={20} color={osloBranding.colors.primary} />
              <View style={styles.factContent}>
                <Text variant="titleSmall" style={styles.factItemTitle}>
                  Innbyggere
                </Text>
                <Text variant="bodyMedium" style={styles.factItemText}>
                  Oslo har rundt 700 000 innbyggere (2024).
                </Text>
              </View>
            </View>
          </View>
          
          <Button
            mode="outlined"
            onPress={() => Linking.openURL('https://no.wikipedia.org/wiki/Oslo')}
            style={styles.wikipediaButton}
            icon="wikipedia"
          >
            Les mer på Wikipedia
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={[styles.container, { padding }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === 'quiz' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('quiz')}
            style={styles.tabButton}
            buttonColor={activeTab === 'quiz' ? osloBranding.colors.primary : undefined}
            icon="quiz"
          >
            Quiz
          </Button>
          <Button
            mode={activeTab === 'history' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('history')}
            style={styles.tabButton}
            buttonColor={activeTab === 'history' ? osloBranding.colors.primary : undefined}
            icon="map-marker"
          >
            Gatenavn
          </Button>
          <Button
            mode={activeTab === 'facts' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('facts')}
            style={styles.tabButton}
            buttonColor={activeTab === 'facts' ? osloBranding.colors.primary : undefined}
            icon="lightbulb-on"
          >
            Fun Facts
          </Button>
        </View>

        {/* Tab Content */}
        {activeTab === 'quiz' && renderQuiz()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'facts' && renderFacts()}
      </ScrollView>

      {/* Add History Dialog */}
      <Portal>
        <Dialog visible={showAddHistory} onDismiss={() => setShowAddHistory(false)}>
          <Dialog.Title>Legg til gatenavn-historie</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Gatenavn"
              value={newStreetName}
              onChangeText={setNewStreetName}
              style={styles.dialogInput}
              mode="outlined"
            />
            <TextInput
              label="Bydel (valgfritt)"
              value={newDistrict}
              onChangeText={setNewDistrict}
              style={styles.dialogInput}
              mode="outlined"
            />
            <TextInput
              label="Beskrivelse"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              numberOfLines={4}
              style={styles.dialogInput}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddHistory(false)}>Avbryt</Button>
            <Button 
              onPress={handleAddStreetHistory}
              loading={loading}
              disabled={loading}
            >
              Lagre
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  tabButton: {
    flex: 1,
    minWidth: 100,
  },
  tabContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  quizCard: {
    marginBottom: SPACING.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  scoreText: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  percentageText: {
    color: '#666',
  },
  divider: {
    marginVertical: SPACING.md,
  },
  questionText: {
    marginBottom: SPACING.lg,
    fontWeight: 'bold',
  },
  optionsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  optionButton: {
    minHeight: BUTTON_MIN_HEIGHT,
  },
  correctAnswer: {
    backgroundColor: '#4caf50',
  },
  wrongAnswer: {
    backgroundColor: '#f44336',
  },
  explanationContainer: {
    backgroundColor: '#e3f2fd',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  explanationText: {
    color: '#1976d2',
  },
  quizActions: {
    marginTop: SPACING.md,
  },
  submitButton: {
    minHeight: BUTTON_MIN_HEIGHT,
  },
  nextButton: {
    minHeight: BUTTON_MIN_HEIGHT,
  },
  infoCard: {
    marginTop: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    color: '#666',
  },
  loader: {
    marginVertical: SPACING.xl,
  },
  addCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#e3f2fd',
  },
  addHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  addTitle: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  addDescription: {
    color: '#666',
    marginBottom: SPACING.md,
  },
  addButton: {
    minHeight: BUTTON_MIN_HEIGHT,
  },
  historyCard: {
    marginBottom: SPACING.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  streetName: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  districtChip: {
    backgroundColor: osloBranding.colors.primary + '20',
  },
  districtChipText: {
    color: osloBranding.colors.primary,
  },
  historyDescription: {
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  authorText: {
    color: '#666',
  },
  dateText: {
    color: '#999',
  },
  emptyCard: {
    marginTop: SPACING.xl,
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  factCard: {
    marginBottom: SPACING.md,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  factTitle: {
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  factsList: {
    gap: SPACING.md,
  },
  factItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  factContent: {
    flex: 1,
  },
  factItemTitle: {
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  factItemText: {
    color: '#666',
    lineHeight: 22,
  },
  factDivider: {
    marginVertical: SPACING.md,
  },
  wikipediaButton: {
    marginTop: SPACING.lg,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  dialogInput: {
    marginBottom: SPACING.md,
  },
});

export default OsloScreen;

