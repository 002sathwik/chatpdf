import AWS from 'aws-sdk';

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            },
            region: 'ap-south-1'
        });

        const fileKey = 'uploads/' + Date.now().toString() + '_' + file.name;
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: fileKey,
            Body: file
        };

        const upload = s3.upload(params).on('httpUploadProgress', evt => {
            console.log('Uploading to S3...', parseInt(((evt.loaded * 100) / evt.total).toString())) + "%";
        });

        await upload.promise(); 

        console.log('Successfully uploaded to S3:', fileKey);
        
        return {
            fileKey,
            fileName: file.name
        };

    } catch (error) {
        console.error('Error uploading file to S3:', error);
    }
}

export function getS3Url( fileKey:string){
    const url = `https://${ process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.se.ap-south-1.amazonaws.com/${fileKey}`
    console.log(url);
    
    return url;
}
