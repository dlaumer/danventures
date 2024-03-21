// TranslationHelper.ts (updated to use Redux)
import { useSelector } from 'react-redux';
// TranslationHelper.ts (updated to use Redux)

import { selectLanguage } from '../store/selectors';
import translations from '../constants/translations';

// let translations: Record<number, Record<string, string>> = null;
let lang = 'en';
export function getTranslation(id: string): string {
    const language = useSelector(selectLanguage);
    lang = language;
    if (Object.keys(translations).includes(id)) {
        return (translations as any)[id][language] || '';
    } else {
        console.log('WARNING: One string is missing: ' + id);
        return id;
    }
}

export function getTranslationForLanguage(
    id: string,
    language: string
): string {
    lang = language;
    return (translations as any)[id][language] || '';
}

// It is not yet possible to change the layer name in the LayerList widget with react. So in order to use the getTranslation inside to create a ArcGIS Widget, it cannot include a useSelector. So I tried to do the next best thing and just remember the last language that was set and just use that one.
export function getTranslationStatic(id: string): string {
    if (Object.keys(translations).includes(id)) {
        return (translations as any)[id][lang] || '';
    } else {
        console.log('WARNING: One string is missing: ' + id);
        return id;
    }
}
// export async function loadCSVFile(
//     path: string
// ): Promise<Record<string, Record<string, string>>> {
//     return new Promise((resolve, reject) => {
//         const fileReader = new FileReader();

//         fileReader.onload = (event) => {
//             const csvData = event.target?.result;
//             if (typeof csvData === 'string') {
//                 const dataArray = parseCSVData(csvData); // Convert the parsed CSV data into an array
//                 resolve(dataArray);
//             } else {
//                 reject(new Error('Failed to parse CSV data.'));
//             }
//         };

//         fileReader.onerror = (event) => {
//             reject(
//                 event.target?.error || new Error('Failed to load CSV file.')
//             );
//         };

//         fetch(csvFilePath)
//             .then((response) => response.blob())
//             .then((blob) => fileReader.readAsText(blob))
//             .catch((error) => reject(error));
//     });
// }

// export async function loadTranslations(
//     path: string
// ): Promise<Record<number, Record<string, string>>> {
//     try {
//         translations = await loadCSVFile(path);
//         console.log(translations);
//         return translations;
//     } catch (error) {
//         console.error('Error loading translations:', error);
//         return {};
//     }
// }

// function parseCSVData(csvData: string): Record<string, Record<string, string>> {
//     // Parse the csvData and convert it into an array
//     const lines = csvData.split('\n');
//     const dataArray: Record<string, Record<string, string>> = {};

//     // Assuming the CSV file has a header row
//     const headers = lines[0].split(';');
//     //headers.pop();

//     for (let i = 1; i < lines.length; i++) {
//         const values = lines[i].split(';');
//         const dataItem: Record<string, string> = {};

//         for (let j = 0; j < headers.length; j++) {
//             dataItem[headers[j]] = values[j];
//         }

//         dataArray[dataItem.id] = dataItem;
//     }
//     console.log(dataArray);
//     return dataArray;
// }
