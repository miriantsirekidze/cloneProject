import {
  launchImageLibrary,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';
import { pick, types, keepLocalCopy } from '@react-native-documents/picker';
import { uploadFile } from '../../../../utils/firebase/firebaseStorage';

export interface FileObject {
  uri: string;
  name: string;
  type: 'image' | 'document';
  size?: number;
  id?: string;
}

export interface PickedFileResult {
  uri: string;
  name?: string;
  type?: string;
  size?: number;
  id?: string;
}

export const selectImage = (): Promise<PickedFileResult[]> => {
  return new Promise(resolve => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 5, includeExtra: true },
      (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          resolve([]);
        } else if (response.assets && response.assets.length > 0) {
          const files: PickedFileResult[] = response.assets.map(asset => ({
            uri: asset.uri || '',
            name: asset.fileName,
            type: asset.type,
            size: asset.fileSize,
            id: asset.id || asset.fileName,
          }));
          resolve(files);
        } else {
          resolve([]);
        }
      },
    );
  });
};

export const handleCameraLaunch = (): Promise<PickedFileResult[]> => {
  return new Promise(resolve => {
    launchCamera({ mediaType: 'photo' }, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        resolve([]);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        resolve([
          {
            uri: asset.uri || '',
            name: asset.fileName,
            type: asset.type,
            size: asset.fileSize,
            id: asset.id || asset.fileName,
          },
        ]);
      } else {
        resolve([]);
      }
    });
  });
};

export const pickDocument = async (): Promise<PickedFileResult[]> => {
  try {
    const pickedResults = await pick({
      mode: 'open',
      allowMultiSelection: true,
      type: [types.pdf],
    });

    if (pickedResults.length === 0) {
      return [];
    }

    const filesToCopy = pickedResults.map(file => ({
      uri: file.uri,
      fileName: file.name ?? 'unknown_file',
    }));

    const copyResults = await keepLocalCopy({
      files: filesToCopy as any,
      destination: 'cachesDirectory',
    });

    const validFiles: PickedFileResult[] = [];

    copyResults.forEach((result, index) => {
      if (result.status === 'success') {
        const original = pickedResults[index];

        validFiles.push({
          uri: result.localUri,
          name: original.name ?? undefined,
          type: original.type ?? undefined,
          size: original.size ?? undefined,
          id: original.uri,
        });
      } else {
        console.warn(`Failed to copy file: ${result.sourceUri}`);
      }
    });

    return validFiles;
  } catch (error) {
    if (error instanceof Error && error.message.includes('canceled')) {
      return [];
    }
    console.error('DocumentPicker Error:', error);
    return [];
  }
};

export const processFormFiles = async (
  formData: any,
  fields: any[],
  uid: string | undefined,
) => {
  if (!uid) {
    throw new Error('User ID is missing. Cannot upload files.');
  }

  console.log('--- STARTING FILE PROCESS ---');

  const processedData = { ...formData };

  for (const field of fields) {
    const isFileField = field.fieldType === 'FILE';

    if (isFileField) {
      const key = field.fieldName;
      const fileObjects: (FileObject | string)[] = formData[key];

      console.log(`Processing field '${key}' (Type: ${field.fieldType})`);

      if (Array.isArray(fileObjects) && fileObjects.length > 0) {
        console.log(`> Found ${fileObjects.length} files to upload...`);

        try {
          const downloadUrls = await Promise.all(
            fileObjects.map(file => {
              if (typeof file === 'string') {
                return Promise.resolve(file);
              }

              if (
                file.uri &&
                (file.uri.startsWith('http://') ||
                  file.uri.startsWith('https://'))
              ) {
                return Promise.resolve(file.uri);
              }

              return uploadFile(file.uri, uid, file.name);
            }),
          );

          console.log(`> Upload complete. URLs:`, downloadUrls);

          processedData[key] = downloadUrls;
        } catch (uploadError) {
          console.error(`> FAILED to upload files for ${key}`, uploadError);
          throw uploadError;
        }
      } else {
        console.log(`> No files selected for ${key}`);
        processedData[key] = [];
      }
    }
  }

  console.log('--- FILE PROCESS COMPLETE ---');
  return processedData;
};
