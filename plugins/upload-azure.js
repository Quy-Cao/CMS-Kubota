import { CONTAINER_NAME } from "~/plugins/constant.js";
import { BlobServiceClient } from "@azure/storage-blob";
import moment from 'moment';

export const uploadFile = async(files, blobSasUrl) => {
  const blobServiceClient = new BlobServiceClient(blobSasUrl);

  const containerName = CONTAINER_NAME.MODEL;
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const content = files[0];
  let blockBlobClient;
  blockBlobClient = containerClient.getBlockBlobClient(files[0].name);
  /*if(files[0].name.includes('fbx')) {
    blockBlobClient = containerClient.getBlockBlobClient(files[0].name);
  } else {
    blockBlobClient = containerClient.getBlockBlobClient(`${files[0].name}_${moment().format('YYYYMMDDhhmmss')}`);
  }*/

  const uploadBlobResponse = await blockBlobClient.uploadBrowserData(content);
  return uploadBlobResponse._response.request.url;
}
