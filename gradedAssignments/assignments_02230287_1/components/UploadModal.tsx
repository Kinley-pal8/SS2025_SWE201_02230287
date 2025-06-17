import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ visible, onClose }) => {
  const [uploadData, setUploadData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    audioFile: null,
    coverImage: null,
    isUploading: false,
    uploadProgress: 0
  });

  // Animation refs
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleFileSelect = () => {
    // In a real app, you'd use a file picker library like react-native-document-picker
    Alert.alert(
      "Select Audio File", 
      "Choose an audio file to upload",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Select File", 
          onPress: () => setUploadData(prev => ({ ...prev, audioFile: "midnight-dreams.mp3" }))
        }
      ]
    );
  };

  const handleCoverSelect = () => {
    // In a real app, you'd use an image picker library
    Alert.alert(
      "Select Cover Image",
      "Choose a cover image for your track",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Select Image", 
          onPress: () => setUploadData(prev => ({ ...prev, coverImage: "cover-art.jpg" }))
        }
      ]
    );
  };

  const handleUpload = async () => {
    if (!uploadData.title.trim()) {
      Alert.alert("Missing Information", "Please provide a track title");
      return;
    }
    
    if (!uploadData.audioFile) {
      Alert.alert("Missing File", "Please select an audio file to upload");
      return;
    }

    setUploadData(prev => ({ ...prev, isUploading: true, uploadProgress: 0 }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadData(prev => {
        if (prev.uploadProgress >= 100) {
          clearInterval(interval);
          Alert.alert(
            "🎉 Upload Successful!", 
            "Your track has been uploaded and is now live on Biito!",
            [
              {
                text: "Great!",
                onPress: () => {
                  onClose();
                  setUploadData({ 
                    title: "", 
                    artist: "",
                    album: "",
                    genre: "",
                    audioFile: null, 
                    coverImage: null, 
                    isUploading: false, 
                    uploadProgress: 0 
                  });
                }
              }
            ]
          );
          return prev;
        }
        return { ...prev, uploadProgress: prev.uploadProgress + 8 };
      });
    }, 150);
  };

  const handleClose = () => {
    if (uploadData.isUploading) {
      Alert.alert(
        "Upload in Progress",
        "Are you sure you want to cancel the upload?",
        [
          { text: "Continue Uploading", style: "cancel" },
          {
            text: "Cancel Upload",
            style: "destructive",
            onPress: () => {
              onClose();
              setUploadData({ 
                title: "", 
                artist: "",
                album: "",
                genre: "",
                audioFile: null, 
                coverImage: null, 
                isUploading: false, 
                uploadProgress: 0 
              });
            }
          }
        ]
      );
      return;
    }

    onClose();
    // Reset form when closing
    setTimeout(() => {
      setUploadData({ 
        title: "", 
        artist: "",
        album: "",
        genre: "",
        audioFile: null, 
        coverImage: null, 
        isUploading: false, 
        uploadProgress: 0 
      });
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" />
      <Animated.View 
        style={[
          styles.modalOverlay,
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={handleClose}
          activeOpacity={1}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={['#1A0A1A', '#0A0A0A']}
            style={styles.modalGradient}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={handleClose} 
                disabled={uploadData.isUploading}
                style={styles.headerButton}
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={uploadData.isUploading ? "#666" : "#FFFFFF"} 
                />
              </TouchableOpacity>
              
              <View style={styles.headerTitleContainer}>
                <Ionicons name="cloud-upload-outline" size={24} color="#8B5CF6" />
                <Text style={styles.modalTitle}>Upload Track</Text>
              </View>
              
              <TouchableOpacity 
                onPress={handleUpload}
                disabled={uploadData.isUploading || !uploadData.title.trim() || !uploadData.audioFile}
                style={[
                  styles.headerButton,
                  (!uploadData.title.trim() || !uploadData.audioFile) && styles.headerButtonDisabled
                ]}
              >
                {uploadData.isUploading ? (
                  <ActivityIndicator size="small" color="#8B5CF6" />
                ) : (
                  <LinearGradient
                    colors={
                      (!uploadData.title.trim() || !uploadData.audioFile) 
                        ? ['#666', '#666'] 
                        : ['#8B5CF6', '#A855F7']
                    }
                    style={styles.uploadButtonGradient}
                  >
                    <Text style={styles.uploadButtonText}>Upload</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Track Title Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Track Title <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="musical-note-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your track title"
                    placeholderTextColor="#666"
                    value={uploadData.title}
                    onChangeText={(text) => setUploadData(prev => ({ ...prev, title: text }))}
                    editable={!uploadData.isUploading}
                  />
                </View>
              </View>

              {/* Artist Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Artist Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Your artist name"
                    placeholderTextColor="#666"
                    value={uploadData.artist}
                    onChangeText={(text) => setUploadData(prev => ({ ...prev, artist: text }))}
                    editable={!uploadData.isUploading}
                  />
                </View>
              </View>

              {/* Album Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Album</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="album-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Album name (optional)"
                    placeholderTextColor="#666"
                    value={uploadData.album}
                    onChangeText={(text) => setUploadData(prev => ({ ...prev, album: text }))}
                    editable={!uploadData.isUploading}
                  />
                </View>
              </View>

              {/* Genre Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Genre</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="radio-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Pop, Rock, Hip-Hop"
                    placeholderTextColor="#666"
                    value={uploadData.genre}
                    onChangeText={(text) => setUploadData(prev => ({ ...prev, genre: text }))}
                    editable={!uploadData.isUploading}
                  />
                </View>
              </View>

              {/* Audio File Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Audio File <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.filePicker, 
                    uploadData.isUploading && styles.filePickerDisabled,
                    uploadData.audioFile && styles.filePickerSelected
                  ]} 
                  onPress={handleFileSelect}
                  disabled={uploadData.isUploading}
                >
                  <LinearGradient
                    colors={
                      uploadData.audioFile 
                        ? ['rgba(139, 92, 246, 0.2)', 'rgba(168, 85, 247, 0.1)']
                        : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={styles.filePickerGradient}
                  >
                    <View style={styles.filePickerIcon}>
                      <Ionicons 
                        name={uploadData.audioFile ? "musical-notes" : "cloud-upload-outline"} 
                        size={32} 
                        color={uploadData.audioFile ? "#8B5CF6" : "#666"} 
                      />
                    </View>
                    <Text style={[
                      styles.filePickerText,
                      uploadData.audioFile && styles.filePickerTextSelected
                    ]}>
                      {uploadData.audioFile ? uploadData.audioFile : "Tap to select audio file"}
                    </Text>
                    <Text style={styles.filePickerSubtext}>
                      MP3, WAV, FLAC • Max 50MB
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Cover Image Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cover Art</Text>
                <TouchableOpacity 
                  style={[
                    styles.filePicker, 
                    uploadData.isUploading && styles.filePickerDisabled,
                    uploadData.coverImage && styles.filePickerSelected
                  ]} 
                  onPress={handleCoverSelect}
                  disabled={uploadData.isUploading}
                >
                  <LinearGradient
                    colors={
                      uploadData.coverImage 
                        ? ['rgba(139, 92, 246, 0.2)', 'rgba(168, 85, 247, 0.1)']
                        : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={styles.filePickerGradient}
                  >
                    <View style={styles.filePickerIcon}>
                      <Ionicons 
                        name={uploadData.coverImage ? "image" : "camera-outline"} 
                        size={32} 
                        color={uploadData.coverImage ? "#8B5CF6" : "#666"} 
                      />
                    </View>
                    <Text style={[
                      styles.filePickerText,
                      uploadData.coverImage && styles.filePickerTextSelected
                    ]}>
                      {uploadData.coverImage ? uploadData.coverImage : "Tap to select cover image"}
                    </Text>
                    <Text style={styles.filePickerSubtext}>
                      JPG, PNG • Min 640x640px • Optional
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Upload Progress */}
              {uploadData.isUploading && (
                <View style={styles.uploadProgress}>
                  <LinearGradient
                    colors={['rgba(139, 92, 246, 0.1)', 'rgba(168, 85, 247, 0.05)']}
                    style={styles.uploadProgressGradient}
                  >
                    <View style={styles.uploadProgressHeader}>
                      <Ionicons name="cloud-upload" size={24} color="#8B5CF6" />
                      <Text style={styles.uploadProgressText}>
                        Uploading your track... {uploadData.uploadProgress}%
                      </Text>
                    </View>
                    
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBar}>
                        <LinearGradient
                          colors={['#8B5CF6', '#A855F7']}
                          style={[styles.progressFill, { width: `${uploadData.uploadProgress}%` }]}
                        />
                      </View>
                    </View>
                    
                    <Text style={styles.uploadStatusText}>
                      Processing audio and preparing for streaming...
                    </Text>
                  </LinearGradient>
                </View>
              )}

              {/* Upload Guidelines */}
              <View style={styles.guidelinesContainer}>
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.1)', 'rgba(168, 85, 247, 0.05)']}
                  style={styles.guidelinesGradient}
                >
                  <View style={styles.guidelinesHeader}>
                    <Ionicons name="information-circle" size={20} color="#8B5CF6" />
                    <Text style={styles.guidelinesTitle}>Upload Guidelines</Text>
                  </View>
                  
                  <View style={styles.guidelinesList}>
                    <View style={styles.guidelineItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#8B5CF6" />
                      <Text style={styles.guidelineText}>Supported formats: MP3, WAV, FLAC</Text>
                    </View>
                    <View style={styles.guidelineItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#8B5CF6" />
                      <Text style={styles.guidelineText}>Maximum file size: 50MB</Text>
                    </View>
                    <View style={styles.guidelineItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#8B5CF6" />
                      <Text style={styles.guidelineText}>Cover art: 640x640px minimum</Text>
                    </View>
                    <View style={styles.guidelineItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#8B5CF6" />
                      <Text style={styles.guidelineText}>Ensure you own all rights to the music</Text>
                    </View>
                    <View style={styles.guidelineItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#8B5CF6" />
                      <Text style={styles.guidelineText}>Content will be reviewed before going live</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.bottomSpacing} />
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.9,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  uploadButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  required: {
    color: '#8B5CF6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 16,
    fontWeight: '500',
  },
  filePicker: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderStyle: 'dashed',
  },
  filePickerDisabled: {
    opacity: 0.5,
  },
  filePickerSelected: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
    borderStyle: 'solid',
  },
  filePickerGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  filePickerIcon: {
    marginBottom: 12,
  },
  filePickerText: {
    fontSize: 16,
    color: '#B3B3B3',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  filePickerTextSelected: {
    color: '#8B5CF6',
  },
  filePickerSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  uploadProgress: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadProgressGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  uploadProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadProgressText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  uploadStatusText: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  guidelinesContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  guidelinesGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guidelinesTitle: {
    fontSize: 18,
    color: '#8B5CF6',
    fontWeight: '700',
    marginLeft: 8,
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guidelineText: {
    fontSize: 14,
    color: '#E5E5E5',
    marginLeft: 12,
    fontWeight: '500',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default UploadModal;