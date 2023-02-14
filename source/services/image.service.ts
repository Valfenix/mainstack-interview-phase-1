import AwsS3Integration from '../integrations/aws-s3-integration';
import { S3_BUCKET_NAME } from '../config';

class ImageService {
  // Upload Image to S3
  public static async uploadImageToS3(name: string, image: any, mimetype: string) {
    const awsResponse = await AwsS3Integration.uploadToBucket({
      // ACL: "public-read",
      Body: image.data,
      Bucket: `${S3_BUCKET_NAME}`,
      ContentType: mimetype,
      Key: name,
    });
    const { Location: link } = awsResponse;
    return link;
  }

  public static async deleteImageFromS3(url: string) {
    const contents: string[] = url.split('/');
    const size: number = contents.length;

    const Key: string = contents[size - 1];

    const response = await AwsS3Integration.deleteFromBucket({
      Bucket: `${S3_BUCKET_NAME}`,
      Key,
    });

    return response;
  }
}

export default ImageService;
