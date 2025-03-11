import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { CloudinaryUploadResult } from '@/middleware';
 
// Configuration
cloudinary.config({ 
        cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
         // Click 'View API Keys' above to copy your API secret
    });

export async function POST(request: NextRequest) {
    const {userId} = await auth();

    if(!userId){
        return NextResponse.json({error:"Unauthorized"}, {status:401})
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null ;

        if(!file){
            return NextResponse.json({error: "File not Found"}, {status:400})
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream =  cloudinary.uploader.upload_stream(
                    {folder:'next-cloudinary-uploads'},
                    (error, result) => {
                        if(error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer);
            }
        )
        return NextResponse.json(
            {publicId: result.public_id, secure_url: result.secure_url }, 
            {status:200}
        );

    } catch (error) {
        console.log("Upload image failed !",error);
        return NextResponse.json(
            {error: "Upload image failed !"}, 
            {status:500}
        )
    }
}