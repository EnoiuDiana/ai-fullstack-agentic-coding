import { SupplierDto } from '../../types/dtos/supplier.dto';

export const MOCK_SUPPLIERS: SupplierDto[] = [
    {
        id: 'supp-1',
        name: 'TechSupply Co.',
        contactEmail: 'contact@techsupply.com',
        phoneNumber: '+1-555-0101',
        country: 'USA'
    },
    {
        id: 'supp-2',
        name: 'Fashion Distributors Ltd.',
        contactEmail: 'info@fashiondist.com',
        phoneNumber: '+44-20-5550102',
        country: 'United Kingdom'
    },
    {
        id: 'supp-3',
        name: 'HomeGoods International',
        contactEmail: 'sales@homegoods.com',
        phoneNumber: '+49-30-5550103',
        country: 'Germany'
    },
    {
        id: 'supp-4',
        name: 'ActiveGear Suppliers',
        contactEmail: 'orders@activegear.com',
        phoneNumber: '+61-2-5550104',
        country: 'Australia'
    }
];
