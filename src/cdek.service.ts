import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UUID } from 'crypto';

@Injectable()
export class CdekService {
  private readonly clientId = process.env.CDEK_CLIENT_ID;
  private readonly clientSecret = process.env.CDEK_CLIENT_SECRET;

  private readonly almatyPVZ = {
    code: 'ALM12',
    uuid: '8493c3ec-810a-4961-8e21-8d297f6410ae',
    location: {
      country_code: 'KZ',
      region_code: 1877,
      city_code: 4756,
      city_uuid: '3e1c12fe-52a5-41d6-ad84-5109035138a0',
    },
  };
  private readonly package = [
    {
      title: 'футболки',
      length: 30,
      width: 25,
      height: 3,
      weight: 250,
    },
    {
      title: 'худи',
      length: 35,
      width: 30,
      height: 8,
      weight: 400,
    },
    {
      title: 'лонги',
      length: 30,
      width: 25,
      height: 3,
      weight: 750,
    },
  ];

  // Получение токена
  private async getToken(): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);

      const response = await axios.post(
        'https://api.cdek.ru/v2/oauth/token',
        params,
      );
      return response.data.access_token;
    } catch (error) {
      console.error(
        'Ошибка при получении токена:',
        error.response?.data || error.message,
      );
      throw new Error('Ошибка аутентификации в API СДЭК');
    }
  }

  async calculateDelivery(
    items: {
      name: string;
      size: string;
      type: string;
      quantity: number;
      price: number;
    }[],
    toCity: number,
    currency: number,
  ): Promise<{
    delivery: { weight: number; currency: string; cost: number };
    items: { name: string; cost: number; quantity: number }[];
  }> {
    try {
      const token = await this.getToken();

      // Подбираем упаковку
      const matchedPackages = items.map((item) => {
        const pack = this.package.find(
          (p) => p.title.toLowerCase() === item.type.toLowerCase(),
        );
        return pack;
      });

      // Вычисляем габариты
      const totalWeight = matchedPackages.reduce((sum, p) => sum + p.weight, 0);
      const maxLength = Math.max(...matchedPackages.map((p) => p.length), 0);
      const maxWidth = Math.max(...matchedPackages.map((p) => p.width), 0);
      const totalHeight = matchedPackages.reduce((sum, p) => sum + p.height, 0);

      // Определяем код услуги
      const serviceCode =
        currency === 7
          ? totalWeight >= 1500
            ? 'CARTON_BOX_L'
            : totalWeight >= 750
              ? 'CARTON_BOX_M'
              : 'CARTON_BOX_XS'
          : null;

      // Формируем тело запроса
      const requestData = {
        type: '1',
        tariff_code: '136',
        from_location: { code: this.almatyPVZ.location.city_code },
        to_location: { code: toCity },
        currency: 0,
        packages: [
          {
            weight: totalWeight,
            length: maxLength,
            width: maxWidth,
            height: totalHeight,
          },
        ],
        ...(serviceCode
          ? { services: [{ code: serviceCode, parameter: '1' }] }
          : {}),
      };

      // Отправляем запрос в CDEK API
      const response = await axios.post(
        'https://api.cdek.ru/v2/calculator/tariff',
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Корректируем стоимость доставки
      let deliveryCurrency = 'KZT';
      let cost = Math.round(response.data.total_sum);
      if (currency === 1) {
        cost = Math.round(cost / 4.5 + 0.07 * (cost / 4.5));
        deliveryCurrency = 'RUB';
      } else if (currency === 7) {
        cost = Math.round(cost / 149 + 0.07 * (cost / 149));
        deliveryCurrency = 'BYN';
      }

      // Формируем массив товаров
      const formattedItems = items.map((item) => ({
        name: `${item.name} ${item.size}`,
        cost: item.price,
        quantity: item.quantity,
      }));

      return {
        delivery: {
          weight: response.data.weight_calc,
          currency: deliveryCurrency,
          cost,
        },
        items: formattedItems,
      };
    } catch (error: any) {
      console.error(
        'Ошибка при расчете доставки:',
        error.response?.data || error.message,
      );
      throw new Error('Ошибка при расчете доставки. Проверьте данные.');
    }
  }

  async suggestCity(name: string): Promise<{ code: string; name: string }> {
    try {
      const token = await this.getToken();

      const response = await axios.get(
        'https://api.cdek.ru/v2/location/suggest/cities',
        {
          params: { name },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return { code: response.data.code, name: response.data.full_name };
    } catch (error) {
      console.error(
        'Ошибка при подборе города:',
        error.response?.data || error.message,
      );
      throw new Error('Ошибка при подборе города. Проверьте данные.');
    }
  }

  async findPVZ(
    city_code: number,
    name: string,
  ): Promise<{ code: string; name: string }> {
    try {
      const token = await this.getToken();

      const response = await axios.get(
        'https://api.cdek.ru/v2/deliverypoints',
        {
          params: { city_code, type: 'PVZ', size: 10 },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const pvzList = response.data;

      // Фильтруем по name, если оно передано
      const filteredPVZ = name
        ? pvzList.filter((pvz) => new RegExp(name, 'i').test(pvz.name)) // Регистронезависимый поиск
        : pvzList;

      console.log(' Найденные ПВЗ:', filteredPVZ);
      return { code: filteredPVZ.code, name: filteredPVZ.name };
    } catch (error) {
      console.error(
        ' Ошибка при поиске ПВЗ:',
        error.response?.data || error.message,
      );
      throw new Error('Ошибка при поиске ПВЗ. Проверьте данные.');
    }
  }

  // async registerDelivery(
  //   delivery: { point: string; weight: number; currency: string; cost: number },
  //   recipient: { name: string; phone: number },
  //   items: { name: string; quantity: number }[],
  // ) {
  //   try {
  //     if (!delivery || !recipient || !items?.length) {
  //       throw new Error('Некорректные данные для регистрации доставки');
  //     }

  //     const token = await this.getToken(); // Если getToken асинхронный
  //     const transformedItems = items.map((item, index) => ({
  //       ware_key: index,
  //       name: item.name,
  //       payment: { value: 0 },
  //       cost: 14900,
  //       amount: item.quantity,
  //       weight: 450,
  //     }));

  //     const serviceCode =
  //       delivery.currency === 'BYN'
  //         ? delivery.weight >= 1500
  //           ? 'CARTON_BOX_L'
  //           : delivery.weight >= 750
  //             ? 'CARTON_BOX_M'
  //             : 'CARTON_BOX_XS'
  //         : null;

  //     const payload = {
  //       type: '1',
  //       tariff_code: '136',
  //       shipment_point: this.almatyPVZ.code,
  //       currency: delivery.currency,
  //       delivery_point: delivery.point,
  //       delivery_recipient_cost: { value: delivery.cost },
  //       recipient: {
  //         name: recipient.name,
  //         phones: [{ number: recipient.phone }],
  //       },
  //       packages: [
  //         {
  //           number: '1',
  //           weight: delivery.weight,
  //           weight_volume: delivery.weight,
  //           items: transformedItems,
  //         },
  //       ],
  //       ...(serviceCode
  //         ? { services: [{ code: serviceCode, parameter: '1' }] }
  //         : {}),
  //     };
  //     console.log(payload);
  //     const response = await axios.post(
  //       'https://api.cdek.ru/v2/orders',
  //       payload,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );

  //     console.log('Успешная регистрация доставки:', response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error(
  //       'Ошибка при регистрации доставки:',
  //       error.response?.data.errors || error.message,
  //     );
  //     throw new Error('Ошибка при регистрации доставки. Проверьте данные.');
  //   }
  // }
}
