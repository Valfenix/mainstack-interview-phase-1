import crypto from 'crypto';
import moment from 'moment';
import { UploadedFile } from 'express-fileupload';
import { Namespaces } from '../constants/namespace.constant';
import Logger from '../util/logger';

const logger = new Logger('general', Namespaces.FUNCTIONS);

class UtilFunctions {
  public static generateRandomString = (length = 16): string => {
    return crypto.randomBytes(length).toString('hex');
  };

  /******
   *
   *
   *
   * Validate Image Upload
   */

  public static async validateUploadedFile({
    file: theFile,
    maxSize = 1000000, // 1 Mega bytes
    allowedMimeTypes = ['image/jpeg', 'image/png'],
  }: {
    file: UploadedFile | UploadedFile[];
    maxSize?: number;
    allowedMimeTypes?: string[];
  }): Promise<any> {
    const file = theFile as UploadedFile;
    if (file.size > maxSize) {
      return {
        error: 'The file selected is too large for upload. The maximum size supported is 1MB',
        success: false,
      };
    }

    const fileType = file.mimetype;
    if (!allowedMimeTypes.includes(fileType)) {
      return {
        error: `We've found an issue with the file type ${fileType.toString()} selected. The file type supported is ${allowedMimeTypes.toString()}. Please check and try again`,
        success: false,
      };
    }

    return {
      data: file,
      success: true,
    };
  }
}

export default UtilFunctions;

export function throwIfUndefined<T>(x: T | undefined, name?: string): T {
  if (x === undefined) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}

export const slugify = (text: string) => {
  const text_new = text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  return text_new;
};

export const countUniqueItems = (e: any) => {
  return new Set(e).size;
};

export const convertDate = (date: any) => {
  return new Date(date).toISOString();
};

export const getPercent = (number: number) => {
  return number / 100;
};

export const getMonthsDate = (startDate: any, stopDate: any) => {
  const dateStart = moment(startDate);
  const dateEnd = moment(stopDate);
  const interim = dateStart.clone();
  const timeValues = [];

  while (dateEnd > interim || interim.format('M') === dateEnd.format('M')) {
    timeValues.push(interim.format('YYYY-MM'));
    interim.add(1, 'month');
  }
  return timeValues;
};
