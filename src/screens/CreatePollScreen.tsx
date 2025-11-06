import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { 
  Card, 
  Text, 
  TextInput, 
  Button, 
  HelperText,
  Chip,
  Snackbar,
  ActivityIndicator
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme, osloBranding } from '../constants/theme';
import { OSLO_DISTRICTS, POLL_CATEGORIES } from '../constants/osloDistricts';
import { createPoll, CreatePollData } from '../services/pollsService';
import { auth } from '../services/firebase';
import { isUserAdmin } from '../utils/adminCheck';
import { validatePollTitle, validatePollDescription, validatePollOption } from '../utils/validation';
import { safeError, safeLog } from '../utils/performance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive, getResponsivePadding } from '../utils/useResponsive';
import { SPACING } from '../constants/spacing';
import { BUTTON_MIN_HEIGHT, CHIP_MIN_HEIGHT } from '../constants/touchTargets';

const CreatePollScreen = () => {
  const { isMobile, isTablet, width } = useResponsive();
  const padding = getResponsivePadding(width);
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [district, setDistrict] = useState<string>('Hele Oslo');
  const [category, setCategory] = useState<string>('politikk');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 dager fra nå
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const admin = await isUserAdmin();
      setIsAdmin(admin);
      if (!admin) {
        setSnackbarMessage('Kun admin-brukere kan opprette avstemninger');
        setSnackbarVisible(true);
      }
    } catch (error) {
      safeError('Feil ved sjekk av admin-status:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleValidation = validatePollTitle(title);
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.error || 'Ugyldig tittel';
    }

    const descValidation = validatePollDescription(description);
    if (!descValidation.valid) {
      newErrors.description = descValidation.error || 'Ugyldig beskrivelse';
    }

    options.forEach((opt, index) => {
      if (!opt.trim()) {
        newErrors[`option_${index}`] = 'Alternativ kan ikke være tomt';
      } else {
        const optValidation = validatePollOption(opt);
        if (!optValidation.valid) {
          newErrors[`option_${index}`] = optValidation.error || 'Ugyldig alternativ';
        }
      }
    });

    if (options.filter(opt => opt.trim()).length < 2) {
      newErrors.options = 'Minimum 2 alternativer påkrevd';
    }

    if (endDate <= startDate) {
      newErrors.dates = 'Sluttdato må være etter startdato';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage('Vennligst fyll ut alle felter korrekt');
      setSnackbarVisible(true);
      return;
    }

    if (!isAdmin) {
      setSnackbarMessage('Kun admin-brukere kan opprette avstemninger');
      setSnackbarVisible(true);
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setSnackbarMessage('Du må være innlogget');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    try {
      const pollData: CreatePollData = {
        title: title.trim(),
        description: description.trim(),
        options: options.filter(opt => opt.trim()).map(opt => ({ text: opt.trim() })),
        startDate,
        endDate,
        district,
        category,
        isActive: true,
      };

      await createPoll(pollData, user.uid, user.email);
      
      setSnackbarMessage('Avstemning opprettet!');
      setSnackbarVisible(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      setDistrict('Hele Oslo');
      setCategory('politikk');
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setErrors({});
    } catch (error: unknown) {
      safeError('Feil ved opprettelse av avstemning:', error);
      const err = error as { message?: string };
      setSnackbarMessage(err.message || 'Kunne ikke opprette avstemning');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Sjekker tilgang...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Icon name="shield-off" size={64} color={osloBranding.colors.textSecondary} />
        <Text variant="headlineSmall" style={styles.errorTitle}>
          Ingen tilgang
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          Kun admin-brukere kan opprette avstemninger.
        </Text>
        <Text variant="bodySmall" style={styles.errorSubtext}>
          Kontakt administrator for å få admin-tilgang.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { padding },
        isTablet && styles.contentTablet,
        isMobile && styles.contentMobile
      ]}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Opprett ny avstemning
          </Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            Fyll ut alle felter for å opprette en ny avstemning
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View>
            <TextInput
              label="Tittel *"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              error={!!errors.title}
              style={styles.input}
            />
            {errors.title && (
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>
            )}
          </View>

          <View>
            <TextInput
              label="Beskrivelse *"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              error={!!errors.description}
              style={styles.input}
            />
            {errors.description && (
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>
            )}
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Alternativer (2-10) *
            </Text>
            {options.map((opt, index) => (
              <View key={index} style={styles.optionRow}>
                <TextInput
                  label={`Alternativ ${index + 1}`}
                  value={opt}
                  onChangeText={(value) => updateOption(index, value)}
                  mode="outlined"
                  error={!!errors[`option_${index}`]}
                  style={styles.optionInput}
                />
                {options.length > 2 && (
                  <Button
                    mode="text"
                    icon="delete"
                    onPress={() => removeOption(index)}
                    style={styles.removeButton}
                  >
                    Fjern
                  </Button>
                )}
                {errors[`option_${index}`] && (
                  <HelperText type="error">
                    {errors[`option_${index}`]}
                  </HelperText>
                )}
              </View>
            ))}
            {options.length < 10 && (
              <Button
                mode="outlined"
                icon="plus"
                onPress={addOption}
                style={styles.addButton}
              >
                Legg til alternativ
              </Button>
            )}
            {errors.options && (
              <HelperText type="error">{errors.options}</HelperText>
            )}
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Bydel
            </Text>
            <View style={styles.chipContainer}>
              {OSLO_DISTRICTS.slice(0, 8).map((dist) => (
                <Chip
                  key={dist}
                  selected={district === dist}
                  onPress={() => setDistrict(dist)}
                  style={styles.chip}
                >
                  {dist}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Kategori
            </Text>
            <View style={styles.chipContainer}>
              {POLL_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  style={styles.chip}
                >
                  {cat}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Datoer
            </Text>
            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <Text variant="bodySmall" style={styles.dateLabel}>
                  Startdato
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowStartDatePicker(true)}
                  icon="calendar"
                  style={styles.dateButton}
                >
                  {startDate.toLocaleDateString('no-NO')}
                </Button>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowStartDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setStartDate(selectedDate);
                      }
                    }}
                    minimumDate={new Date()}
                  />
                )}
              </View>
              <View style={styles.dateInput}>
                <Text variant="bodySmall" style={styles.dateLabel}>
                  Sluttdato
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowEndDatePicker(true)}
                  icon="calendar"
                  style={styles.dateButton}
                >
                  {endDate.toLocaleDateString('no-NO')}
                </Button>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setEndDate(selectedDate);
                      }
                    }}
                    minimumDate={startDate}
                  />
                )}
              </View>
            </View>
            {errors.dates && (
              <HelperText type="error">{errors.dates}</HelperText>
            )}
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            icon="check"
          >
            Opprett avstemning
          </Button>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: SPACING.screenPadding.mobile,
  },
  contentMobile: {
    padding: SPACING.screenPadding.mobile,
  },
  contentTablet: {
    padding: SPACING.screenPadding.tablet,
    maxWidth: SPACING.contentMaxWidth.tablet,
    alignSelf: 'center',
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: osloBranding.colors.textSecondary,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
    marginBottom: 8,
  },
  errorSubtext: {
    textAlign: 'center',
    color: osloBranding.colors.textSecondary,
  },
  card: {
    marginBottom: SPACING.cardMargin.mobile,
    elevation: 2,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: osloBranding.colors.primary,
  },
  subtitle: {
    color: osloBranding.colors.textSecondary,
  },
  input: {
    marginBottom: 8,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  optionRow: {
    marginBottom: 12,
  },
  optionInput: {
    marginBottom: 4,
  },
  removeButton: {
    marginTop: -8,
    marginBottom: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  addButton: {
    marginTop: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    minHeight: CHIP_MIN_HEIGHT,
  },
  submitButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    minHeight: BUTTON_MIN_HEIGHT,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    marginBottom: 8,
    color: osloBranding.colors.textSecondary,
  },
  dateButton: {
    marginBottom: SPACING.sm,
    minHeight: BUTTON_MIN_HEIGHT,
  },
});

export default CreatePollScreen;

