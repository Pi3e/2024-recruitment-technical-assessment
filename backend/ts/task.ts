type FileData = {
  id: number;
  name: string;
  categories: string[];
  parent: number;
  size: number;
};

/**
 * Task 1
 */
function leafFiles(files: FileData[]): string[] {
  const leafFiles: string[] = [];
  files.forEach((file) => {
    if (!files.some((f) => f.parent === file.id)) {
      // checking if id matches to any files parent
      leafFiles.push(file.name);
    }
  });
  return leafFiles;
}

/**
 * Task 2
 */
function kLargestCategories(files: FileData[], k: number): string[] {
  const categoryCount: { [name: string]: number } = {};
  files.forEach((file) => {
    file.categories.forEach((c) => {
      // creating list of catergories and a popularity count
      categoryCount[c] ? categoryCount[c]++ : (categoryCount[c] = 1);
    });
  });
  //const categoryArray = Object.entries(categoryCount); - Cant get object.entries working for the life of me
  const categoryArray: [string, number][] = [];
  // converting object to array to sort easier
  for (const category in categoryCount) {
    categoryArray.push([category, categoryCount[category]]);
  }

  categoryArray.sort((a, b) => {
    //sorting by popularity then alphabetically
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    } else {
      return a[0].localeCompare(b[0]);
    }
  });
  // reducing array to remove popularity part, slicing first k categories
  const topCategories = categoryArray.map((i) => i[0]).slice(0, k);
  return topCategories;
}

/**
 * Task 3
 */
function largestFileSize(files: FileData[]): number {
  // object to save all ids sizes
  const fileSize: { [id: number]: number } = {};
  const checkSize = (parent: FileData): number => {
    // If already found no point finding again
    if (fileSize[parent.id]) return fileSize[parent.id];
    let size = parent.size;
    // checking size of all children recuirsvely
    files.forEach((f) => {
      if (f.parent === parent.id) {
        size += checkSize(f);
      }
    });
    fileSize[parent.id] = size;
    return size;
  };

  files.forEach((file) => {
    checkSize(file);
  });
  //   console.log(fileSize);

  // objects.values not working :(
  const sizes: number[] = [];
  for (const id in fileSize) {
    sizes.push(fileSize[id]);
  }
  sizes.sort((a, b) => b - a);
  return sizes[0];
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const testFiles: FileData[] = [
  { id: 1, name: 'Document.txt', categories: ['Documents'], parent: 3, size: 1024 },
  { id: 2, name: 'Image.jpg', categories: ['Media', 'Photos'], parent: 34, size: 2048 },
  { id: 3, name: 'Folder', categories: ['Folder'], parent: -1, size: 0 },
  { id: 5, name: 'Spreadsheet.xlsx', categories: ['Documents', 'Excel'], parent: 3, size: 4096 },
  { id: 8, name: 'Backup.zip', categories: ['Backup'], parent: 233, size: 8192 },
  { id: 13, name: 'Presentation.pptx', categories: ['Documents', 'Presentation'], parent: 3, size: 3072 },
  { id: 21, name: 'Video.mp4', categories: ['Media', 'Videos'], parent: 34, size: 6144 },
  { id: 34, name: 'Folder2', categories: ['Folder'], parent: 3, size: 0 },
  { id: 55, name: 'Code.py', categories: ['Programming'], parent: -1, size: 1536 },
  { id: 89, name: 'Audio.mp3', categories: ['Media', 'Audio'], parent: 34, size: 2560 },
  { id: 144, name: 'Spreadsheet2.xlsx', categories: ['Documents', 'Excel'], parent: 3, size: 2048 },
  { id: 233, name: 'Folder3', categories: ['Folder'], parent: -1, size: 4096 },
];

console.assert(
  arraysEqual(
    leafFiles(testFiles).sort((a, b) => a.localeCompare(b)),
    [
      'Audio.mp3',
      'Backup.zip',
      'Code.py',
      'Document.txt',
      'Image.jpg',
      'Presentation.pptx',
      'Spreadsheet.xlsx',
      'Spreadsheet2.xlsx',
      'Video.mp4',
    ]
  )
);

console.assert(arraysEqual(kLargestCategories(testFiles, 3), ['Documents', 'Folder', 'Media']));

console.assert(largestFileSize(testFiles) == 20992);
