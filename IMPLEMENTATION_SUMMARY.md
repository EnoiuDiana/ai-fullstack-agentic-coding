# Order Address Collection - Implementation Summary

## Overview

Successfully implemented delivery address collection in the order creation flow, removing the workaround where orders were created with null addresses.

## Changes Made

### Backend Changes

#### 1. **AddressDto.java** - Added Validation

- Added `@NotBlank` validation on all fields (country, city, county, streetAddress)
- Added `@Size` constraints matching database limits
- File: `onlineshopapi/src/main/java/msg/onlineshopapi/dto/AddressDto.java`

#### 2. **AddressMapper.java** - Added toEntity Method

- Implemented bidirectional mapping with new `toEntity(AddressDto)` method
- Enables conversion from DTO to domain model
- File: `onlineshopapi/src/main/java/msg/onlineshopapi/dto/mapper/AddressMapper.java`

#### 3. **OrderRequestDto.java** - Added Address Field

- Added `@NotNull` and `@Valid` address field
- Address is now required for order creation
- File: `onlineshopapi/src/main/java/msg/onlineshopapi/dto/OrderRequestDto.java`

#### 4. **OrderMapper.java** - Map Address from Request

- Updated `toEntity()` to map address from OrderRequestDto using AddressMapper
- Handles null addresses gracefully for backward compatibility
- File: `onlineshopapi/src/main/java/msg/onlineshopapi/dto/mapper/OrderMapper.java`

#### 5. **OrderController.java** - Enable Validation

- Added `@Valid` annotation to `create()` method's request body parameter
- Triggers Jakarta validation on incoming order requests
- File: `onlineshopapi/src/main/java/msg/onlineshopapi/controller/OrderController.java`

### Frontend Changes

#### 6. **CreateOrderDto Type** - Added Address Field

- Updated TypeScript type to include required `address: AddressDto` field
- File: `onlineshopui/src/app/core/types/dtos/order.dto.ts`

#### 7. **AddressFormComponent** - New Reusable Component

- Created standalone reactive form component with 4 address fields
- Features:
  - All fields required with validation (max length matching backend)
  - Real-time validation feedback
  - Emits valid address or null via output event
  - Touch-based error display (errors show after field touched)
  - Tailwind CSS styling matching existing design
- Files:
  - `onlineshopui/src/app/clib/components/address-form/address-form.component.ts`
  - `onlineshopui/src/app/clib/components/address-form/address-form.component.html`

#### 8. **Cart Utils** - Accept Address Parameter

- Updated `toCreateOrderDto()` to accept address parameter
- Includes address in returned CreateOrderDto
- Added AddressDto import
- File: `onlineshopui/src/app/features/cart/utils/cart.utils.ts`

#### 9. **Cart Overview Page Component** - Collect Address

- Added `deliveryAddress` signal to track address state
- Added `addressError` signal for validation messages
- Implemented `onAddressChange()` handler
- Updated `onCheckout()` to validate address before submission
- Imported AddressFormComponent
- File: `onlineshopui/src/app/features/cart/components/pages/cart-overview-page/cart-overview-page.component.ts`

#### 10. **Cart Overview Page Template** - Display Address Form

- Added "Delivery Address" section between cart items and summary
- Embedded AddressFormComponent with event binding
- Shows validation error if checkout attempted without complete address
- Wrapped in styled card matching design system
- File: `onlineshopui/src/app/features/cart/components/pages/cart-overview-page/cart-overview-page.component.html`

#### 11. **Mock Handler** - Use Request Address

- Updated mock order creation to use address from request body
- File: `onlineshopui/src/app/core/mocks/interceptors/handlers/orders-handler.mock.ts`

## Verification Results

✅ **Frontend build successful** - All TypeScript compilation passed
✅ **Order detail page already displays addresses** - No changes needed (lines 43-51)
✅ **Mock data supports addresses** - Existing mock orders have complete addresses

## Testing Checklist

### Backend Testing (When Maven is available)

```bash
cd onlineshopapi
mvn test
```

**Test scenarios to verify:**

- [ ] Order creation with valid address succeeds (201 Created)
- [ ] Order creation without address fails (400 Bad Request)
- [ ] Order creation with invalid address fields fails (400 Bad Request with validation errors)
- [ ] Created orders have address persisted in database

### Frontend Testing

```bash
cd onlineshopui
npm test
```

**Test scenarios:**

- [ ] Address form validates all required fields
- [ ] Checkout button validation prevents submission without address
- [ ] Successful order creation includes address in payload
- [ ] Error handling for backend validation failures

### Manual E2E Testing

**Prerequisites:**

```bash
# 1. Start database
cd docker/development && docker-compose up -d

# 2. Start backend (from project root)
cd ../../onlineshopapi && mvn spring-boot:run -Dspring-boot.run.profiles=local

# 3. Start frontend (from project root, new terminal)
cd onlineshopui && npm start
```

**Test Flow:**

1. Navigate to http://localhost:4200
2. Login as customer (john.doe@email.com / password)
3. Add products to cart
4. Go to cart page
5. **Verify:** Address form displays with 4 fields (country, city, county, street address)
6. **Verify:** All fields show red asterisk (required)
7. Try to checkout without filling address
8. **Verify:** Error message appears: "Please complete the delivery address before placing your order"
9. Fill in delivery address with valid data:
   - Country: USA
   - City: Seattle
   - County: King
   - Street Address: 123 Main Street
10. Click "Proceed to Checkout"
11. **Verify:** Success notification appears
12. **Verify:** Redirected to orders page
13. Click on the new order
14. **Verify:** Order detail page shows complete delivery address
15. Check database:
    ```sql
    SELECT id, country, city, county, street_address
    FROM onlineshop.orders
    ORDER BY created_at DESC
    LIMIT 1;
    ```
16. **Verify:** Address columns are populated (not NULL)

## Rollback Plan

If issues are discovered:

1. **Temporary: Make address optional** - Change `@NotNull` to `@Nullable` in OrderRequestDto.java
2. **Frontend: Hide address form** - Comment out address form section in cart template
3. **Revert changes:** Use git to revert to previous commit

## Known Limitations

1. **No address validation** - Currently accepts any text input; no postal code validation, country selection dropdown, or address verification service
2. **No saved addresses** - Users must enter address for every order; no address book feature
3. **Database constraints** - Address columns still nullable in database; consider adding NOT NULL constraints in future migration after verifying all orders have addresses

## Future Enhancements

1. **Address Book** - Save multiple addresses per user, allow selection during checkout
2. **Address Validation** - Integrate with address verification API (Google Maps, etc.)
3. **Country Dropdown** - Replace text input with country selector
4. **Auto-complete** - Use browser geolocation or IP-based suggestions
5. **Default Address** - Mark one address as default for returning customers
6. **Edit Address** - Allow address modification before order confirmation
7. **Database Constraints** - Add NOT NULL constraints once all existing orders have addresses

## Files Changed

**Backend (5 files):**

- `onlineshopapi/src/main/java/msg/onlineshopapi/dto/AddressDto.java`
- `onlineshopapi/src/main/java/msg/onlineshopapi/dto/OrderRequestDto.java`
- `onlineshopapi/src/main/java/msg/onlineshopapi/dto/mapper/AddressMapper.java`
- `onlineshopapi/src/main/java/msg/onlineshopapi/dto/mapper/OrderMapper.java`
- `onlineshopapi/src/main/java/msg/onlineshopapi/controller/OrderController.java`

**Frontend (6 files + 2 new):**

- `onlineshopui/src/app/core/types/dtos/order.dto.ts`
- `onlineshopui/src/app/clib/components/address-form/address-form.component.ts` _(new)_
- `onlineshopui/src/app/clib/components/address-form/address-form.component.html` _(new)_
- `onlineshopui/src/app/features/cart/utils/cart.utils.ts`
- `onlineshopui/src/app/features/cart/components/pages/cart-overview-page/cart-overview-page.component.ts`
- `onlineshopui/src/app/features/cart/components/pages/cart-overview-page/cart-overview-page.component.html`
- `onlineshopui/src/app/core/mocks/interceptors/handlers/orders-handler.mock.ts`

**Total:** 13 files (11 modified, 2 created)
