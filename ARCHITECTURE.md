# Architecture

```text
Customer Browser
      |
      v
Next.js App Router
      |
      +---- Customer UI
      +---- Admin UI
      +---- Route Handlers
                |
                +---- Auth/session
                +---- Checkout
                +---- Product/category/coupon CRUD
                +---- Order management
                |
                v
          PostgreSQL / Sequelize
                |
        +-------+---------+
        |                 |
        v                 v
 WhatsApp Cloud API    Twilio SMS
```

## Order confirmation

```text
POST /api/orders
      |
      +-- validate session
      +-- validate product availability
      +-- calculate subtotal
      +-- calculate coupon
      +-- calculate shipping
      |
      v
PostgreSQL transaction
      |
      +-- create shipping address
      +-- create order
      +-- create order items
      +-- decrement stock
      +-- increment coupon usage
      |
      v
Order committed
      |
      +-- notify admin(s) via WhatsApp
      +-- notify admin(s) via SMS
      +-- optional customer WhatsApp/SMS
      |
      v
NotificationLog
```

Messaging failure never rolls back a successfully committed order.
