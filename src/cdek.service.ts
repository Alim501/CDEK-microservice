import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CdekService {
  private readonly clientId = 'ВАШ_CLIENT_ID';
  private readonly clientSecret = 'ВАШ_CLIENT_SECRET';

  private async getToken() {
    const response = await axios.post(
      'https://api.edu.cdek.ru/v2/oauth/token',
      {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      },
    );

    return response.data.access_token;
  }

  async calculateDelivery(data: any) {
    const { fromCity, toCity, weight, length, width, height } = data;
    const token = await this.getToken();

    const response = await axios.post(
      'https://api.edu.cdek.ru/v2/calculator/tariff',
      {
        tariff_code: 10,
        from_location: { city: fromCity },
        to_location: { city: toCity },
        packages: [
          {
            weight,
            length,
            width,
            height,
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  }
}
