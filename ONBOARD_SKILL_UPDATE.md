# Onboard-App Skill Update - Delivery Address Support

## Overview

Updated the `onboard-app` skill to include filling out the delivery address form when placing an order during the automated onboarding flow.

## Changes Made

### Location

**File:** `.claude/skills/onboard-app/SKILL.md`

### Updates

#### 1. Added New Step: "2.8: Fill Delivery Address"

**Inserted between cart viewing and order creation**

```markdown
#### 2.8: Fill Delivery Address

- Scroll to the "Delivery Address" section in the cart page
- Fill the address form using `mcp__chrome-devtools__fill_form` with:
  - Country: `USA`
  - City: `Seattle`
  - County: `King`
  - Street Address: `123 Test Street`
- Take screenshot: `08-delivery-address.png`
- Create explanation: `08-delivery-address.txt` showing the completed delivery address form
```

**Why this matters:**

- The application now requires delivery addresses for orders (as per recent implementation)
- Without filling the address, the "Place Order" button validation will fail
- The skill would fail at checkout without this step

#### 2. Renumbered Subsequent Steps

- **2.8 → 2.9:** "Create Order" (previously 2.8)
- **2.9 → 2.10:** "View Orders Page" (previously 2.9)

#### 3. Added New Step: "2.11: View Order Details"

**New final step to verify the address was saved**

```markdown
#### 2.11: View Order Details

- Click on the newly created order to view its details
- Wait for order detail page to load
- Take screenshot: `11-order-detail.png`
- Create explanation: `11-order-detail.txt` showing order details including the delivery address
```

**Why this is important:**

- Verifies end-to-end flow: address input → order creation → address persistence
- Provides visual confirmation that the delivery address is displayed correctly
- Validates the entire feature works as expected

## Test Address Data

The skill uses the following test delivery address:

- **Country:** USA
- **City:** Seattle
- **County:** King
- **Street Address:** 123 Test Street

These values match the expected format and validation rules of the address form.

## Screenshot Sequence

Updated screenshot numbering to reflect new steps:

| #      | Screenshot                    | Description                                  |
| ------ | ----------------------------- | -------------------------------------------- |
| 01     | `01-homepage.png`             | Application homepage                         |
| 02     | `02-registration.png`         | User registration                            |
| 03     | `03-login-success.png`        | Login success                                |
| 04     | `04-product-catalog.png`      | Product catalog                              |
| 05     | `05-product-detail.png`       | Product details                              |
| 06     | `06-add-to-cart.png`          | Add to cart confirmation                     |
| 07     | `07-cart-view.png`            | Cart with items                              |
| **08** | **`08-delivery-address.png`** | **Completed delivery address form** ✨ NEW   |
| **09** | **`09-order-created.png`**    | **Order creation confirmation** (renumbered) |
| **10** | **`10-orders-page.png`**      | **Orders list page** (renumbered)            |
| **11** | **`11-order-detail.png`**     | **Order detail with address** ✨ NEW         |

## Integration with Recent Changes

This skill update complements the recent implementation where:

### Backend

- `OrderRequestDto` now requires `AddressDto`
- Address validation enforced with `@Valid` annotation
- Orders cannot be created without complete addresses

### Frontend

- Cart page displays address form component
- Address form has 4 required fields with validation
- Checkout validates address completion before submission
- Order detail page displays saved delivery address

### Skill Flow

The automated onboarding now:

1. ✅ Fills out the address form (matches backend requirements)
2. ✅ Validates the form is complete before clicking "Place Order"
3. ✅ Captures screenshot of completed form
4. ✅ Verifies address appears in order details

## Error Handling

The skill's existing error handling will catch any issues:

- If address fields are missing or mislabeled, screenshot will capture the error
- If validation fails, the order creation step will fail with a clear error state
- Each step has its own error capture and reporting

## Testing the Updated Skill

To test the updated onboarding skill:

```bash
# In Claude Code, run:
/onboard-app
```

Or say: "Demo the app" or "Show me how the online shop works"

**Expected outcome:**

- All 11 steps complete successfully
- Screenshot `08-delivery-address.png` shows completed address form with all 4 fields filled
- Screenshot `11-order-detail.png` shows the order detail page with the delivery address displayed
- No validation errors during checkout

## Benefits

1. **Complete E2E Testing** - The skill now tests the full order flow including address collection
2. **Automated Validation** - Verifies that address is both collected and persisted correctly
3. **Visual Documentation** - Screenshots provide visual proof of the feature working
4. **Onboarding Accuracy** - New users see the complete order placement process including address

## Files Changed

**Total:** 1 file modified

- `.claude/skills/onboard-app/SKILL.md` - Added address filling step, renumbered subsequent steps, added order detail verification step
