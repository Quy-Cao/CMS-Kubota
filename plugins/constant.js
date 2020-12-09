export const API_URL = {
  apiUploadThumbnail: process.env.baseURLV1 + 'api/v1/series/UploadThumbnail',
};

export const IS_DRAFT = {
  ALL: {
    id: 'all',
    name: 'All'
  },
  PUBLISH: {
    id: 0,
    name: 'Publish',
    nameJp: 'Publish',
  },
  UNPUBLISH: {
    id: 1,
    name: 'Unpublish',
    nameJp: 'Unpublish',
  },
  DISABLE: {
    id: 2,
    name: 'Disable',
    nameJp: 'Disable',
  },
};

export const PAGE_SIZE = 10;

export const URL_MENU = {
  SERIES: ['/series', '/models', '/errorCodes', '/issues', '/versions'],
  LANGUAGES: ['/languages'],
  CARDTYPES: ['/cardTypes'],
  CARDS: ['/cards'],
  INSTRUCTIONS: ['/instructions'],
  BUTTONS: ['/buttons'],
  MEDIA: ['/media'],
  ISSUECATEGORIES: ['/issueCategories'],
  REPORTS: ['/reports'],
  DISTRIBUTORS: ['/distributors']
};

export const SUB_MENU_KEYS = ['series', 'cards', 'instructions', 'media', 'buttons', 'languages', 'reports'];

export const AMOUNT_BUTTONS = 3;

export const TYPE_MEDIA = {
  IMAGES: 1,
  VIDEOS: 2,
  MODELS: 3
};

export const IS_REQUIRED = {
  REQUIRED: {
    id: 1,
    name: 'Required',
  },
  NOT_REQUIRED: {
    id: 2,
    name: 'Not required'
  }
}

export const TYPE_MODELS = {
  ERRORCODES: 1,
  ISSUES: 2,
}

export const BULK_ACTION = {
  PUBLISH: {
    id: 0,
    name: 'Publish',
  },
  UNPUBLISH: {
    id: 1,
    name: 'Unpublish',
  },
  DISABLE: {
    id: 2,
    name: 'Disable',
  },
  COPY_MODEL: {
    id: -1,
    name: 'Copy to other model',
  }
}

export const CHOOSE_DATA_TYPE = {
  INSTRUCTIONS: 1,
  MEDIA: 2,
  BUTTONS: 3,
  CARDS: 4,
  MODEL3D: 5
}

export const IS_END_DIAGNOSIS = {
  END_DIAGNOSIS: {
    id: '1',
    name: 'No button; end of diagnosis'
  },
  NOT_END_DIAGNOSIS: {
    id: '0',
    name: 'Button(s) to proceed'
  }
}

export const STATUS_REPORTS = {
  OPEN: {
    id: 1,
    name: 'Open',
  },
  CLOSE: {
    id: 0,
    name: 'Close'
  }
}

export const CHECK_RADIO_REPORTS = {
  ERRORCODES: 'Error Code',
  ISSUES: 'Issues' ,
}

export const STATUS_ERROR = {
  PUBLISH: {
    id: 0,
    name: 'Publish',
    nameJp: 'Publish',
  },
  UNPUBLISH: {
    id: 1,
    name: 'Unpublish',
    nameJp: 'Unpublish',
  },
  DISABLE: {
    id: 2,
    name: 'Disable',
    nameJp: 'Disable',
  },
};

export const REPORT_STATUSES = ['Closed', 'Open'];

export const TYPE_DOWNLOAD = {
  CURRENT: 1,
  VERSION: 2
};

export const USER_ROLES = {
  ADMIN: 'administrator',
  KTC: 'ktcuser',
  KBT: 'kbtuser'
};

export const BRANCH_ACTIONS = {
  CREATE: 'create',
  SAVE: 'save',
  DELETE: 'delete'
}

export const CONTAINER_NAME = {
  MODEL: 'upload-file-ltt'
}

export const FILE_UPLOAD = {
  FILE_IOS: 'file-ios',
  FILE_ANDROID: 'file-android',
  FILE_CSV: 'file-csv',
  MODEL_TRACKING: 'model-tracking',
  TRACKING_LEFT: 'tracking-left',
  TRACKING_RIGHT: 'tracking-right'
}

export const FILE_SIZE = {
  MAX_SIZE: 100,
  MAX_SIZE_VIDEO: 30,
  MAX_SIZE_IMAGE: 5
}

