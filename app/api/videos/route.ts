
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(){
    try{
        const video =  await prisma.video.findMany({
            orderBy: {createdAt: 'desc'},
        })   

        return NextResponse.json(video)
    }catch(error){
        console.error("Failed to fetch videos", error)
        return NextResponse.json(
            {error: "Something went wrong with fetching video" },
            {status: 500}

        )
    }
    finally{
        await prisma.$disconnect()
    }
}