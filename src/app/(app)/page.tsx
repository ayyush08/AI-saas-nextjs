'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import AutoPlay from 'embla-carousel-autoplay'
const page = () => {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>
          Start your Anonymous Conversations today
        </h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>
          Explore Inkognito - Where your identity is never known but messages are !!
        </p>
      </section>
      <Carousel
      plugins={[AutoPlay({delay:2000})]}
      className="w-full max-w-xs">
        <CarouselContent>
          {
            messages.map((msg,idx)=>(
              <CarouselItem key={idx}>
              <div className="p-1">
                <Card>
                  <CardHeader>
                    {msg.title}
                  </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <span className="text-xl font-semibold">{msg.content}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  )
}

export default page