import { google, sheets_v4 } from 'googleapis';
import { config } from '../config/index.js';
import { Product } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets | null = null;

  async initialize(): Promise<void> {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: config.googleSheets.serviceAccountEmail,
          private_key: config.googleSheets.privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      logger.info('Google Sheets service initialized');
    } catch (error) {
      logger.error('Failed to initialize Google Sheets:', error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    if (!this.sheets) {
      await this.initialize();
    }

    try {
      const response = await this.sheets!.spreadsheets.values.get({
        spreadsheetId: config.googleSheets.sheetId,
        range: `${config.googleSheets.sheetName}!A2:H100`,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        logger.warn('No products found in sheet');
        return [];
      }

      return rows.map((row: string[], index: number) => this.parseProductRow(row, index));
    } catch (error) {
      logger.error('Failed to fetch products:', error);
      throw error;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getProducts();
    const lowerQuery = query.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        (product.description?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) ?? null;
  }

  async getCarouselProducts(limit = 6): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.inStock).slice(0, limit);
  }

  private parseProductRow(row: string[], index: number): Product {
    return {
      id: row[0] || `product-${index + 1}`,
      name: row[1] || 'Unknown Product',
      category: this.parseCategory(row[2] ?? ''),
      priceRetail: parseFloat(row[3]) || 0,
      priceWholesale: row[4] ? parseFloat(row[4]) : undefined,
      unit: row[5] || 'กก.',
      imageUrl: row[6] || '',
      description: row[7] || undefined,
      inStock: row[8]?.toLowerCase() !== 'false',
    };
  }

  private parseCategory(category: string): Product['category'] {
    const lower = category.toLowerCase();
    if (lower.includes('seafood') || lower.includes('ทะเล') || lower.includes('หมึก') || lower.includes('กุ้ง') || lower.includes('ปลา')) {
      return 'seafood';
    }
    if (lower.includes('pork') || lower.includes('หมู')) {
      return 'pork';
    }
    return 'other';
  }
}

export const googleSheetsService = new GoogleSheetsService();
