
import {NextRequest , NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest){
    try{
        const video =  await prisma.video.findMany({
            orderBy: {createdAt: 'desc'},
        })   

        return NextResponse.json(video)
    }catch(error){
        return NextResponse.json(
            {error: "Something went wrong with fetching video" },
            {status: 500}

        )
    }
    finally{
        await prisma.$disconnect()
    }
}