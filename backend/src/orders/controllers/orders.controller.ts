import { Body, Delete, Get, Param, ParseUUIDPipe, Query, HttpStatus } from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { Controller, Post } from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { OrdersService } from '@/orders/services/orders.service';

@Controller('api/orders')
@Auth(AuthType.Bearer, UserRole.USER, UserRole.ADMIN)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @CurrentUser('sub') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse }> {
    return await this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  async getUserOrders(
    @CurrentUser('sub') userId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<OrderDto> & { message: string }> {
    const result = await this.ordersService.findAll(userId, query);

    return {
      ...result,
      message: result.message,
    };
  }

  @Get(':orderId')
  async getUserOrderById(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.ordersService.findOne(userId, orderId);
  }

  @Get(':orderId/check-payment-status')
  async checkPaymentStatus(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.ordersService.findOne(userId, orderId);
  }

  @Delete(':orderId/cancel')
  async cancelOrder(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDto> {
    return await this.ordersService.cancel(userId, orderId);
  }
}
