INSERT INTO suppliers (id, name, contact_email, phone_number, country)
VALUES ('5d0011e1-0000-4000-8000-000000000001', 'TechSupply Co.', 'contact@techsupply.com', '+1-555-0101', 'USA'),
       ('5d0011e2-0000-4000-8000-000000000002', 'Fashion Distributors Ltd.', 'info@fashiondist.com', '+44-20-5550102', 'United Kingdom'),
       ('5d0011e3-0000-4000-8000-000000000003', 'HomeGoods International', 'sales@homegoods.com', '+49-30-5550103', 'Germany'),
       ('5d0011e4-0000-4000-8000-000000000004', 'ActiveGear Suppliers', 'orders@activegear.com', '+61-2-5550104', 'Australia');

UPDATE products SET supplier_id = '5d0011e1-0000-4000-8000-000000000001' WHERE category_id = 'ca7e0001-0000-0000-0000-000000000001';
UPDATE products SET supplier_id = '5d0011e2-0000-4000-8000-000000000002' WHERE category_id = 'ca7e0002-0000-0000-0000-000000000002';
UPDATE products SET supplier_id = '5d0011e3-0000-4000-8000-000000000003' WHERE category_id = 'ca7e0003-0000-0000-0000-000000000003';
UPDATE products SET supplier_id = '5d0011e4-0000-4000-8000-000000000004' WHERE category_id = 'ca7e0004-0000-0000-0000-000000000004';
