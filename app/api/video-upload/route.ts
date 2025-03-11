import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient()
// Configuration
cloudinary.config({ 
        cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
        // Click 'View API Keys' above to copy your API secret
    });

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number;
    width?: number;
    height?: number;
    format?: string;
    resource_type?: string;
    created_at?: string;
    secure_url?: string;
    // Add other specific properties returned by Cloudinary if needed
}

export async function POST(request: NextRequest) {

    try {
        const {userId} = await auth();
        if(!userId){
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }
        if(
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ){
            return NextResponse.json(
                {error: "Cloudinary not configured"}, 
                {status:500}
            )
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null ;
        const title = formData.get('title') as string ;
        const description = formData.get('description') as string ; 
        const originalSize = formData.get('originalSize') as string ;

        if(!file){
            return NextResponse.json(
                {error: "File not Found"}, 
                {status:400}
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream =  cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'video',
                        folder:'video-uploads',
                        transformation: [
                            {quality: 'auto', fetch_format: "mp4"},
                        ]
                    },
                    (error, result) => {
                        if(error){
                            console.log("CLoudinary upload error",error)
                            reject(error);
                        } else{ 
                            resolve(result as CloudinaryUploadResult);
                        }
                    }
                );
                uploadStream.end(buffer);
            }
        )
        if(!result){
            return NextResponse.json(
                {error: "Upload to cloudinary failed!"}, 
                {status:500}
            )
        }
        const video = await prisma.video.create({
            data: {
                title,
                description,
                originalSize: originalSize ,
                publicId: result.public_id,
                compressedSize: String(result.bytes),
                duration: result.duration || 0 , 
                
            }
        })
        return NextResponse.json(video)


    } catch (error) {
        console.log("Upload video failed !",error);
        return NextResponse.json(
            {error: "Upload video failed !"}, 
            {status:500}
        )
    }
    finally{
        await prisma.$disconnect();
    }
}