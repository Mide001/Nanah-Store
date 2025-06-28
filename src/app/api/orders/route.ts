import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Type definition for order item
interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, totalAmount, items, paymentTxHash } = body

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        totalAmount,
        paymentTxHash,
        items: {
          create: items.map((item: OrderItemInput) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
} 