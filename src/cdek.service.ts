import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CdekService {
  private readonly clientId = process.env.CDEK_CLIENT_ID;
  private readonly clientSecret = process.env.CDEK_CLIENT_SECRET;

  // Получение токена
  private async getToken() {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);

      const response = await axios.post(
        'https://api.edu.cdek.ru/v2/oauth/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
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

  // Расчет доставки
  async calculateDelivery(toCity: number) {
    try {
      const token = await this.getToken();

      const response = await axios.post(
        'https://api.edu.cdek.ru/v2/calculator/tariff',
        {
          type: '2',
          tariff_code: '234',
          from_location: {
            code: 256,
          },
          to_location: {
            code: toCity,
          },
          services: [
            {
              code: 'COURIER_PACKAGE_A2',
            },
          ],
          packages: [
            {
              weight: 1,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log('Успешный расчет доставки:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Ошибка при расчете доставки:',
        error.response?.data || error.message,
      );
      throw new Error('Ошибка при расчете доставки. Проверьте данные.');
    }
  }
}
