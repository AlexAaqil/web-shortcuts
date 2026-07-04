---
title: "Ecommerce"
description: "Notes about ecommerce"
pubDate: "July 26 2026"
heroImage: "../../../assets/blog-placeholder.jpg"
categories: ['projects', 'ecommerce projects']
---

## Ecommerce Basics

### Must Haves

1. Collection lists or grouped of products - lists groups of products you offer for easier navigation to what the user needs.
1. Filtering and Sorting - help the user have an easier time finding what they need. First should be all products filter then the different selects for different categories or specific products a user wants to see.
1. Product page - help communicate all that's needed to sell the product.
1. Product variants - like size or color.
1. Search function - most direct way to find what you're looking if you know what you're looking for. Best is to use instant search, which shows results soon as you type in the search box.
1. User accounts and customer dashboards - helps to manage and track orders and make it easier to be a repeat customer due to loyalty programs.
1. Shopping cart - users can modify their order and retailers can showcase recommendations or a calculator for how far you are from getting a free shipping or gift from the order you're making. An empty shopping cart can be used to recommend products or help explore other products.
1. Checkout - where users pay and include shipping details and methods with different price, discounts they can get and the order details for what they're purchasing.
1. Payment gateways - the more the payment methods, the higher the probability for clients to convert.
1. Automated message flows - like notifications for back in store, order shipment with tracking, customer account notifications, customer reviews.
1. Customer support and FAQs - reduce the friction as much as possible and facilitate the purchase by making it easy for customer to get answers to questions or understand what it is they need to understand about the product. Can be an FAQ page, a live chat bot, knowledge base page, whatsapp business or video ask, contact forms or pages, phone call links.
1. Users pov
    - Users can see the order they have made.
    - Users can easily review and view the products they have reviewed.
1. Products
    - Categories can have sub-categories.

## Multi Store Ecommerce

### DB Schema

```php
Schema::create('users', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('name', 120);
    string('email')->unique();
    string('phone', 20)->nullable();
    unsignedTinyInteger('role')->default(3);
    string('image')->nullable();
    timestamp('email_verified_at')->nullable();
    boolean('is_anonymized')->default(false);
    timestamp('deleted_at')->nullable();
    string('password');
    rememberToken();
    timestamps();
});

Schema::create('addresses', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('phone', 20)->nullable();
    $table->string('recipient_name', 120);
    string('address_line1');
    string('address_line2')->nullable();
    string('country_code', 2);
    string('state');
    string('city');
    string('postal_code', 20);
    string('recipient_name', 120)->nullable();

    boolean('is_default')->default(false);
    unsignedTinyInteger('type')->default(2);

    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    timestamps();

    index(['user_id', 'is_default']);
});

Schema::create('shop_categories', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('name')->unique();
    string('slug')->unique();
    string('image')->nullable();
    integer('sort_order')->default(0);
    timestamps();
});

Schema::create('shops', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('name', 150);
    string('slug')->unique();
    string('custom_slug')->nullable()->unique();
    text('description')->nullable();
    string('logo_image')->nullable();
    string('cover_image')->nullable();
    string('contact_email')->nullable();
    string('contact_phone')->nullable();
    boolean('is_active')->default(true);
    boolean('is_verified')->default(false);
    json('settings')->nullable(); // Store shop preferences
    foreignId('shop_category_id')->nullable()->constrained('shop_categories')->nullOnDelete();
    foreignId('owner_id')->constrained('users')->cascadeOnDelete();
    softDeletes();
    timestamps();

    unique(['owner_id', 'name']);

    index(['is_active', 'is_verified']);
});

Schema::create('product_categories', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('name', 100)->unique();
    string('slug')->unique();
    text('description')->nullable();
    string('image')->nullable();
    integer('sort_order')->default(0);
    boolean('is_active')->default(true);
    foreignId('parent_id')->nullable()->constrained('product_categories')->cascadeOnDelete();
    timestamps();

    index('slug');
    index('parent_id');
    index(['is_active', 'sort_order']);
});

Schema::create('products', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('name', 200);
    string('slug')->unique();
    string('sku')->unique();
    text('description')->nullable();
    decimal('cost_price', 12, 2)->nullable();
    decimal('price', 12, 2);
    json('attributes')->nullable(); // {"brand": "Nike", "material": "Cotton"}
    boolean('is_featured')->default(false);
    boolean('is_active')->default(true);
    string('barcode', 50)->nullable()->unique();
    decimal('weight', 10, 2)->nullable();
    string('weight_units')->nullable();

    // Stock columns
    // Whether inventory tracking is enabled for this product
    $table->boolean('track_inventory')->default(true);
    // false (cannot sell what you don't have)
    $table->boolean('allow_backorders')->default(false);
    // Max quantity per order (prevents bulk buying)
    $table->integer('max_qty_per_order')->nullable();
    $table->integer('min_qty_per_order')->default(1);

    // For SEO
    string('meta_title', 60)->nullable();
    string('meta_description', 160)->nullable();
    string('canonical_url')->nullable();
    json('structured_data')->nullable(); // For rich snippets
    // Rating
    unsignedTinyInteger('average_rating')->default(0);
    integer('total_reviews')->default(0);
    integer('total_sold')->default(0);
    // Relationships
    foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
    foreignId('product_category_id')->nullable()->constrained('product_categories')->nullOnDelete();
    softDeletes();
    timestamps();

    unique(['shop_id', 'name']);

    index(['price', 'is_active']);
    index(['shop_id', 'is_active']);
    index('slug');
    index('product_category_id');
    index('sku');
});

Schema::create('product_images', function (Blueprint $table) {
    id();
    string('name');
    integer('sort_order')->default(0);
    unsignedTinyInteger('type')->default(1);
    foreignId('product_id')->constrained('products')->cascadeOnDelete();
    timestamps();

    index(['product_id', 'sort_order']);
});

Schema::create('customer_groups', function (Blueprint $table) {
    id();
    string('name');
    string('slug')->unique();
    text('description')->nullable();
    boolean('is_active')->default(true);
    timestamps();
});

Schema::create('customer_group_users', function (Blueprint $table) {
    id();
    foreignId('customer_group_id')->constrained('customer_groups')->cascadeOnDelete();
    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    timestamps();

    unique(['customer_group_id', 'user_id']);
});

Schema::create('discounts', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('name');
    decimal('value', 12, 2); // Discount value
    unsignedTinyInteger('type')->default(0); // 0=percentage, 1=fixed_amount
    unsignedTinyInteger('scope')->default(0); // 0=shop_wide, 1=product_category, 2=specific_products
    decimal('min_order_amount', 12, 2)->nullable();
    integer('min_quantity')->nullable();
    timestamp('starts_at');
    timestamp('expires_at');
    boolean('is_active')->default(true);

    // Priority system (lower number = higher priority)
    unsignedTinyinteger('priority')->default(100);

    // Stacking behavior
    boolean('stackable')->default(false);
    unsignedTinyInteger('stacking_behaviour')->default(0); // Enum: 0 = add, 1 = multiply, 2 = max

    // Usage limits
    unsignedInteger('usage_limits')->nullable();
    unsignedInteger('usage_per_customer')->nullable();

    // customer eligibility
    string('customer_eligibility')->nullable(); // // JSON or enum for customer groups

    // BOGO Suppport (Buy X Get Y)
    integer('buy_quantity')->nullable(); // Buy X items
    integer('get_quantity')->nullable(); // Get Y items free
    string('free_product_sku')->nullable(); // Specific product or "cheapest"

    // Combined discount limits
    decimal('max_discount_amount', 12, 2)->nullable();
    decimal('min_discount_amount', 12, 2)->nullable();

    // Application rules
    boolean('apply_to_sale_items')->default(true);
    boolean('requires_coupon_code')->default(false);
    string('coupon_code')->nullable()->unique();

    // Metadata
    json('metadata')->nullable(); // For additional rules/conditions

    foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
    foreignId('customer_group_id')->nullable()->constrained('customer_groups')->nullOnDelete();
    timestamps();

    index(['shop_id', 'is_active', 'starts_at', 'expires_at', 'priority']);
    index(['scope', 'is_active']);
    index(['requires_coupon_code', 'coupon_code']);
    index(['customer_group_id', 'is_active']);
    index(['scope', 'priority', 'stackable']);
});

Schema::create('discount_categories', function (Blueprint $table) {
    id();
    foreignId('discount_id')->constrained('discounts')->cascadeOnDelete();
    foreignId('product_category_id')->constrained('product_categories')->cascadeOnDelete();
    timestamps();

    index(['discount_id', 'product_category_id']);
});

Schema::create('discount_products', function (Blueprint $table) {
    id();
    foreignId('discount_id')->constrained('discounts')->cascadeOnDelete();
    foreignId('product_id')->constrained('products')->cascadeOnDelete();

    // Product-specific overrides
    decimal('override_value', 12, 2)->nullable(); // Different discount for this product
    unsignedTinyInteger('override_type')->nullable(); // Enum: 0 = percentage, 1 = Fixed amount
    boolean('exclude_from_category_discounts')->default(false);
    timestamps();

    unique(['discount_id', 'product_id']);

    index(['discount_id', 'product_id']);
    index(['discount_id', 'exclude_from_category_discounts']);
});

Schema::create('discount_usage', function (Blueprint $table) {
    id();
    decimal('discount_amount_applied', 12, 2);
    json('context_snapshot')->nullable(); // Store what was discounted
    foreignId('discount_id')->constrained('discounts')->cascadeOnDelete();
    foreignId('order_id')->constrained('orders')->cascadeOnDelete();
    foreignId('customer_id')->nullable()->constrained('users')->nullOnDelete();
    foreignId('cart_id')->nullable();
    timestamp('used_at');
    timestamps();

    index(['discount_id', 'customer_id']);
    index(['order_id']);
    index(['used_at']);
});

// for complex validation rules:
Schema::create('discount_conditions', function (Blueprint $table) {
    id();
    foreignId('discount_id')->constrained('discounts')->cascadeOnDelete();

    // Condition types: 'time_of_day', 'day_of_week', 'first_purchase', 'minimum_items', etc.
    string('condition_type');
    string('operator')->default('='); // =, >, <, >=, <=, in, not_in
    json('value'); // Stores condition value(s)
    json('metadata')->nullable();

    timestamps();

    index(['discount_id', 'condition_type']);
});

Schema::create('product_variants', function (Blueprint $table) {
    id();
    string('sku')->unique();
    json('attributes')->nullable(); // {"color": "red", "size": "M"}
    decimal('cost_price', 12, 2)->nullable();
    decimal('price_adjustment', 12, 2)->default(0);
    string('barcode', 50)->nullable();
    integer('low_stock_threshold')->default(5);
    integer('stock_qty')->default(0);
    string('image')->nullable();
    foreignId('product_id')->constrained('products')->cascadeOnDelete();
    softDeletes();
    timestamps();

    index('sku');
});

Schema::create('product_views', function (Blueprint $table) {
    id();
    string('ip_address', 45)->nullable();
    foreignId('product_id')->constrained('products')->cascadeOnDelete();
    foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
    timestamps();

    index(['product_id', 'created_at']);
});

Schema::create('product_specifications', function (Blueprint $table) {
    id();
    foreignId('product_id')->constrained('products')->cascadeOnDelete();
    string('name'); // e.g., "Brand", "Material", "Warranty"
    string('value'); // e.g., "Nike", "Cotton", "2 Years"
    integer('sort_order')->default(0);
    timestamps();

    index(['product_id', 'sort_order']);
});

Schema::create('inventory_locations', function (Blueprint $table) {
    id();
    foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
    string('name'); // "Main Warehouse", "Nairobi Store"
    string('address')->nullable();
    string('city')->nullable();
    string('country')->nullable();
    boolean('is_default')->default(false);
    timestamps();
});

Schema::create('inventory_stocks', function (Blueprint $table) {
    id();
    foreignId('product_id')->constrained('products')->cascadeOnDelete();
    foreignId('variant_id')->nullable()->constrained('product_variants')->cascadeOnDelete();
    foreignId('location_id')->constrained('inventory_locations');
    integer('quantity')->default(0);
    integer('reserved')->default(0);
    timestamps();

    unique(['product_id', 'variant_id', 'location_id']);
});

Schema::create('carts', function (Blueprint $table) {
    id();
    string('session_id')->nullable()->unique();
    string('currency', 3)->default('KES');
    timestamp('expires_at')->nullable();
    foreignId('user_id')->nullable()->unique()->constrained('users')->cascadeOnDelete(); // One cart per user
    timestamps();
});

Schema::create('cart_items', function (Blueprint $table) {
    id();
    integer('quantity')->check('quantity > 0');
    foreignId('cart_id')->constrained('carts')->cascadeOnDelete();
    foreignId('product_id')->constrained('products')->nullOnDelete();
    foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
    foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
    timestamps();

    unique(['cart_id', 'product_id', 'variant_id', 'shop_id']);
});

Schema::create('coupons', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('code')->unique();
    string('name');
    unsignedTinyInteger('type')->default(0);
    decimal('value', 12, 2);
    decimal('min_order_amount', 12, 2)->nullable();
    integer('usage_limit')->nullable();
    integer('used_count')->default(0);
    dateTime('starts_at');
    dateTime('expires_at');
    boolean('is_active')->default(true);
    foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
    timestamps();

    index('code');
    index(['is_active', 'expires_at']);
});

Schema::create('coupon_redemptions', function (Blueprint $table) {
    id();
    uuid()->unique();
    foreignId('coupon_id')->constrained('coupons')->cascadeOnDelete();
    foreignId('order_id')->constrained('orders')->cascadeOnDelete();
    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    decimal('discount_amount', 12, 2);
    timestamps();
});

Schema::create('delivery_locations', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('name')->unique();
    string('slug')->unique();
    boolean('is_active')->default(true);
    integer('sort_order')->default(0);
    timestamps();
});

Schema::create('delivery_areas', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('name')->unique();
    string('slug')->unique();
    decimal('shipping_cost', 10, 2);
    integer('estimated_days')->default(2);
    boolean('is_active')->default(true);
    integer('sort_order')->default(0);
    foreignId('delivery_location_id')->constrained('delivery_locations')->cascadeOnDelete();
    timestamps();

    unique(['name', 'delivery_location_id']);
    index(['delivery_location_id', 'is_active']);
});

Schema::create('orders', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('order_number')->unique();
    decimal('subtotal', 12, 2);
    decimal('discount_amount', 12, 2)->default(0);
    decimal('shipping_cost', 12, 2)->default(0);
    decimal('tax_amount', 12, 2)->default(0);
    decimal('total_amount', 12, 2);
    unsignedTinyInteger('status')->default(0); // 0 = pending, 1 = processing, 2 = paid, 3 = shipped.
    $table->timestamp('inventory_allocated_at')->nullable();
    unsignedTinyInteger('payment_method')->nullable();
    unsignedTinyInteger('payment_status')->default(0);

    // Track status of inventory allocation for this order
    $table->enum('inventory_status', ['pending', 'allocated', 'partially_shipped', 'shipped'])->default('pending');
    $table->timestamp('inventory_allocated_at')->nullable();

    text('notes')->nullable();
    timestamp('paid_at')->nullable();
    timestamp('cancelled_at')->nullable();

    // Snapshots of customer info, delivery, pricing at order time (for when user gets anonymized)
    // customer: name, email, phone
    json('customer_details_snapshot')->nullable();
    // delivery location, delivery area, delivery address, phone
    json('delivery_details_snapshot')->nullable();
    // subtotal, shipping, discount, tax, total
    json('pricing_snapshot')->nullable();
    // method, phone, transaction_id
    json('payment_snapshot')->nullable();

    // Types of deletion
    boolean('is_test_order')->default(false);
    boolean('is_void')->default(false);
    timestamp('voided_at')->nullable();
    foreignId('voided_by')->nullable()->constrained('users');
    text('void_reason')->nullable();

    foreignId('shop_id')->constrained('shops')->restrictOnDelete(); // Don't delete shop with orders
    foreignId('shipping_address_id')->constrained('addresses')->restrictOnDelete();
    foreignId('billing_address_id')->constrained('addresses')->restrictOnDelete();
    foreignId('coupon_id')->nullable()->constrained('coupons')->nullOnDelete(); // Keep order if coupon deleted;
    foreignId('customer_id')->constrained('users')->restrictOnDelete();
    softDeletes();
    timestamps();

    index(['customer_id', 'status']);
    index('order_number');
    index('shop_id');
    index(['status', 'payment_status']);
    index('created_at');
    index(['is_test_order', 'is_void']); // For cleanup queries
    index('deleted_at'); // For soft delete queries
});

Schema::create('order_items', function (Blueprint $table) {
    id();
    integer('quantity');
    decimal('unit_price', 12, 2);
    decimal('discount', 12, 2)->default(0);
    decimal('total_price', 12, 2);
    // Snapshot of product info (in case product is deleted later)
    string('product_name_snapshot', 200);
    string('product_sku_snapshot', 100);
    json('product_variant_snapshot')->nullable();
    foreignId('order_id')->constrained('orders')->cascadeOnDelete();
    foreignId('product_id')->constrained('products')->restrictOnDelete();
    foreignId('variant_id')->nullable()->constrained('product_variants')->restrictOnDelete();
    timestamps();

    index(['order_id']);
    index(['product_id']);
    index(['order_id', 'product_id']);
});

Schema::create('payments', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('transaction_id')->unique(); // From payment gateway
    decimal('amount', 12, 2);
    unsignedTinyInteger('type')->default(0);
    unsignedTinyInteger('status')->default(0);
    unsignedTinyInteger('payment_method')->nullable();
    json('gateway_response')->nullable(); // Store webhook data
    string('failure_reason')->nullable();
    foreignId('order_id')->constrained('orders')->restrictOnDelete();
    timestamps();

    index('transaction_id');
});

Schema::create('refunds', function (Blueprint $table) {
    id();
    uuid()->unique();
    decimal('amount', 12, 2);
    text('reason');
    unsignedTinyInteger('status')->default(0);
    foreignId('order_id')->constrained('orders')->restrictOnDelete();
    foreignId('payment_id')->constrained('payments')->restrictOnDelete();
    timestamps();
});

Schema::create('shipments', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('tracking_number')->nullable();
    string('carrier', 50);
    string('service_level')->nullable(); // Express, Standard, etc.
    timestamp('shipped_at')->nullable();
    timestamp('estimated_delivery')->nullable();
    timestamp('delivered_at')->nullable();
    unsignedTinyInteger('status')->default(0);
    json('tracking_history')->nullable(); // Carrier tracking events
    foreignId('order_id')->constrained('orders')->restrictOnDelete();
    timestamps();

    index('tracking_number');
});

Schema::create('vendor_payouts', function (Blueprint $table) {
    id();
    uuid()->unique();
    decimal('amount', 12, 2);
    decimal('platform_fee', 12, 2)->default(0);
    decimal('net_amount', 12, 2);
    unsignedTinyInteger('status')->default(0);
    string('stripe_account_id')->nullable();
    string('transfer_id')->nullable(); // Stripe/PayPal transfer ID
    timestamp('paid_at')->nullable();
    json('metadata')->nullable();
    foreignId('shop_id')->constrained('shops')->restrictOnDelete();
    foreignId('order_id')->constrained('orders')->restrictOnDelete(); // Payout per order
    timestamps();

    index(['shop_id', 'status']);
});

Schema::create('reviews', function (Blueprint $table) {
    id();
    uuid()->unique();
    integer('rating')->check('rating BETWEEN 1 AND 5');
    text('comment')->nullable();
    json('images')->nullable();
    boolean('is_approved')->default(false);
    foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    foreignId('product_id')->nullable()->constrained('products')->cascadeOnDelete(); // Product-specific or shop review
    timestamps();

    unique(['user_id', 'product_id']); // One review per user per product

    index(['shop_id', 'is_approved']);
    index(['product_id', 'is_approved']);
    index(['product_id', 'rating']);
});

Schema::create('posts', function (Blueprint $table) {
    id();
    uuid()->unique();
    text('content');
    json('media_urls')->nullable();
    integer('likes_count')->default(0);
    integer('comments_count')->default(0);
    foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
    softDeletes();
    timestamps();

    index(['shop_id', 'created_at']);
});

Schema::create('post_likes', function (Blueprint $table) {
    id();
    foreignId('post_id')->constrained('posts')->cascadeOnDelete();
    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    timestamps();

    unique(['post_id', 'user_id']);
});

Schema::create('comments', function (Blueprint $table) {
    id();
    uuid()->unique();
    text('content');
    foreignId('post_id')->constrained('posts')->cascadeOnDelete();
    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    foreignId('parent_id')->nullable()->constrained('comments')->cascadeOnDelete();
    softDeletes();
    timestamps();

    index(['post_id', 'created_at']);
});

Schema::create('wishlists', function (Blueprint $table) {
    id();
    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    foreignId('product_id')->constrained('products')->cascadeOnDelete();
    timestamps();

    unique(['user_id', 'product_id']);

    index('user_id');
});

Schema::create('audit_logs', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('action', 100);
    string('entity_type', 50);
    unsignedBigInteger('entity_id')->nullable();
    json('old_data')->nullable();
    json('new_data')->nullable();
    ipAddress('ip_address')->nullable();
    text('user_agent')->nullable();
    foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
    timestamps();

    index(['entity_type', 'entity_id']);
    index('created_at');
});

Schema::create('notifications', function (Blueprint $table) {
    id();
    uuid()->unique();
    string('type'); // order_created, payment_received, etc.
    string('title');
    text('content');
    json('data')->nullable();
    boolean('is_read')->default(false);
    timestamp('read_at')->nullable();
    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    timestamps();

    index(['user_id', 'is_read']);
    index('created_at');
});
```

### Kanban

```md
# KANBAN.md – Multi-Store Ecommerce (Step-by-Step Build Plan)

> **Purpose:** Zero to production. Follow issues in order. Each issue is a small, verifiable step.
> **Structure:** Phases → Epics → Issues → Subtasks (checklists).
> **Reusability:** Copy this file into a new GitHub repo → Projects → Kanban. Start checking boxes.

---

## Phase 0: Setup & Tooling (Do once)

### Epic 0.1: Project Foundation

#### Issue 0.1.1: Initialize Laravel + Frontend Stack

**Labels:** `setup`, `blocking`
**Subtasks:**

- [ ] `laravel new multi-store-ecommerce`
- [ ] Configure database `.env` (PostgreSQL)
- [ ] Install Laravel Sanctum (API auth)
- [ ] Set up Vite + Vue 3 with Inertia.js
- [ ] Install Tailwind CSS + DaisyUI
- [ ] Run migrations successfully

#### Issue 0.1.2: Environment & Git Workflow

**Labels:** `setup`, `devops`
**Subtasks:**

- [ ] Create GitHub repo, add `main` and `dev` branches
- [ ] Set up feature branch workflow (`feature/xxx` → PR to `dev`)
- [ ] Configure pre‑commit hooks (Laravel Pint/ESLint)
- [ ] Add `.env.example` with all required keys (DB, Stripe, M‑Pesa, etc.)
- [ ] Set up Vercel / Forge / Ploi for auto‑deploy from `main`

#### Issue 0.1.3: Type‑Safe Environment (Laravel’s `env()` helper)

**Labels:** `backend`, `robustness`
**Subtasks:**

- [ ] Create `config/services.php` entries for M‑Pesa, Stripe, etc.
- [ ] Add validation to `config/app.php` critical keys (fail fast)

---

## Phase 1: Database & Auth (Your Schema First)

### Epic 1.0: Core Tables & Relationships

#### Issue 1.0.1: Users & Addresses

**Labels:** `db`, `auth`
**Subtasks:**

- [ ] Create `users` migration
- [ ] Create `addresses` migration
- [ ] Create `seeder` for test users (role: super_admin, admin, seller, customer)
- [ ] Run migrations
- [ ] Seed test users

#### Issue 1.0.2: Shops & Categories

**Labels:** `db`, `multi‑tenant`
**Subtasks:**

- [ ] Create `shop_categories` migration
- [ ] Create `shops` migration
- [ ] Add unique index: `unique(['owner_id', 'name'])`
- [ ] Create a seeder for sample shop categories (Electronics, Fashion, etc.)
- [ ] Run migrations
- [ ] Seed sample shop categories

#### Issue 1.0.3: Products & Inventory Core

**Labels:** `db`, `catalog`
**Subtasks:**

- [ ] Create `product_categories` (nested set or parent‑id)
- [ ] Create `products` migration (sku unique, price, stock, shop_id, etc.)
- [ ] Create `product_images`, `product_variants`, `product_specifications`
- [ ] Create `inventory_locations` + `inventory_stocks`
- [ ] Run all migrations

#### Issue 1.0.4: Cart & Discounts

**Labels:** `db`, `cart`
**Subtasks:**

- [ ] Create `carts` + `cart_items` (with `session_id` / `user_id` duality)
- [ ] Create `discounts`, `discount_categories`, `discount_products`
- [ ] Create `coupons` + `coupon_redemptions`

#### Issue 1.0.5: Orders, Payments & Payouts

**Labels:** `db`, `checkout`
**Subtasks:**

- [ ] Create `orders` (snapshot fields: `customer_name_snapshot`, etc.)
- [ ] Create `order_items` (with product snapshots)
- [ ] Create `payments`, `refunds`, `shipments`
- [ ] Create `vendor_payouts`

#### Issue 1.0.6: Social & Auxiliary Tables

**Labels:** `db`, `social`
**Subtasks:**

- [ ] Create `reviews`, `wishlists`, `posts`, `post_likes`, `comments`
- [ ] Create `audit_logs`, `notifications`

---

## Phase 2: Authentication & Base UI

### Epic 2.0: Customer Auth

#### Issue 2.0.1: Registration & Login (API + UI)

**Labels:** `auth`, `frontend`
**Subtasks:**

- [ ] Create Laravel `RegisterController` & `LoginController` (Sanctum)
- [ ] Build registration form (name, email, password)
- [ ] Build login form
- [ ] On success: store token in localStorage/http‑only cookie
- [ ] Redirect to dashboard (customer area)
- [ ] Display toast notification (working, not necessarily smooth yet)

#### Issue 2.0.2: Password Reset & Email Verification

**Labels:** `auth`
**Subtasks:**

- [ ] Use Laravel’s built‑in password reset
- [ ] Configure Mailable templates
- [ ] Add email verification notification (optional)

#### Issue 2.0.3: Profile Management (Customer & Seller)

**Labels:** `auth`, `profile`
**Subtasks:**

- [ ] Create profile edit page (name, email, profile picture)
- [ ] Upload image to S3/local and update `users.image`
- [ ] Add “Delete my account” (set `is_anonymized = true` and nullify personal data)
- [ ] Log account deletion in `audit_logs`

---

## Phase 3: Multi‑Store Setup (Seller Onboarding)

### Epic 3.0: Seller Shop Management

#### Issue 3.0.1: Seller Dashboard Scaffold

**Labels:** `seller`, `ui`
**Subtasks:**

- [ ] Create `/seller` route group with middleware `role:seller`
- [ ] Build sidebar (Shop switcher, Products, Orders, Analytics)
- [ ] Use DaisyUI drawer component

#### Issue 3.0.2: Create a Shop

**Labels:** `seller`, `form`
**Subtasks:**

- [ ] Form: shop name, slug (auto from name), category, logo
- [ ] POST `/api/seller/shops` → insert into `shops` (`is_active = false`, `is_verified = false`)
- [ ] Validate unique slug and `unique(['owner_id', 'name'])`
- [ ] Show “pending approval” badge

#### Issue 3.0.3: Edit Shop Details

**Labels:** `seller`
**Subtasks:**

- [ ] Form pre‑filled with shop data
- [ ] Update `shops` table (cannot change `owner_id`)
- [ ] Upload cover image

#### Issue 3.0.4: Admin Verification of Shops

**Labels:** `admin`, `moderation`
**Subtasks:**

- [ ] Admin panel: list unverified shops
- [ ] Button “Approve” → set `is_verified = true`, `is_active = true`
- [ ] Notify seller via `notifications` table

---

## Phase 4: Product Management (Seller)

### Epic 4.0: Product CRUD

#### Issue 4.0.1: Add Product

**Labels:** `seller`, `catalog`
**Subtasks:**

- [ ] Form: name, description, price, stock_qty, category, images
- [ ] POST `/api/seller/shops/{shop}/products` → insert into `products`
- [ ] Generate unique SKU (e.g., `SHOP_ID_STR_SUFFIX`)
- [ ] Upload multiple product images → `product_images` with sort_order

#### Issue 4.0.2: Edit / Delete Product

**Labels:** `seller`
**Subtasks:**

- [ ] CRUD endpoints with `shop_id` ownership check
- [ ] Soft delete (use `deleted_at`)

#### Issue 4.0.3: Product Variants (Attributes)

**Labels:** `seller`, `variants`
**Subtasks:**

- [ ] UI to add variant options (Size, Color)
- [ ] Generate variant SKU → insert `product_variants`
- [ ] Adjust stock per variant in `inventory_stocks`

#### Issue 4.0.4: Product Specifications

**Labels:** `seller`, `specs`
**Subtasks:**

- [ ] Key‑value pairs UI (Dynamic form)
- [ ] Store in `product_specifications` table
- [ ] Display on product details page

#### Issue 4.0.5: Inventory Management (Stock Levels)

**Labels:** `seller`, `inventory`
**Subtasks:**

- [ ] View current stock per product/variant
- [ ] Update stock with reason (purchase, return, etc.)
- [ ] Low stock threshold warning

---

## Phase 5: Frontend – Customer Experience

### Epic 5.0: Shop Front & Browsing

#### Issue 5.0.1: Home Page – Active Shops

**Labels:** `frontend`, `public`
**Subtasks:**

- [ ] Query `shops` where `is_active = true` and `is_verified = true`
- [ ] Display shop cards (logo, name, category)

#### Issue 5.0.2: Shops Page – Search & Category Filter

**Labels:** `frontend`
**Subtasks:**

- [ ] Search by shop name
- [ ] Filter by `shop_categories`
- [ ] Pagination

#### Issue 5.0.3: Shop Details Page

**Labels:** `frontend`
**Subtasks:**

- [ ] Show shop info, rating (avg from `reviews`), total sales
- [ ] List products belonging to that shop (paginated)
- [ ] Product card → Product Details Page

#### Issue 5.0.4: Product Details Page

**Labels:** `frontend`
**Subtasks:**

- [ ] Product images carousel
- [ ] Price, stock availability, variants dropdown
- [ ] Add to cart button
- [ ] Show specifications and reviews

#### Issue 5.0.5: Deals & Offers Page

**Labels:** `frontend`, `discounts`
**Subtasks:**

- [ ] List products with active discounts (via `discounts` table + `discount_products`)
- [ ] Show discounted price

#### Issue 5.0.6: Products Page (Global Search)

**Labels:** `frontend`, `search`
**Subtasks:**

- [ ] Search across all products (name, description, SKU)
- [ ] Filter by product category, price range, shop
- [ ] Sort by price, rating, newest

---

## Phase 6: Cart & Checkout

### Epic 6.0: Shopping Cart

#### Issue 6.0.1: Add to Cart (Guest & Logged In)

**Labels:** `cart`, `backend`
**Subtasks:**

- [ ] Guest: use `session_id` → `carts` table
- [ ] Logged in: use `user_id` (one cart per user)
- [ ] Merge guest cart into user cart after login
- [ ] Endpoint: `POST /api/cart/items`

#### Issue 6.0.2: View Cart & Update Quantities

**Labels:** `cart`, `frontend`
**Subtasks:**

- [ ] Cart page: list items grouped by shop
- [ ] Change quantity, remove item
- [ ] Apply coupon code (validate via `coupons` table)

#### Issue 6.0.3: Checkout Flow

**Labels:** `checkout`, `critical`
**Subtasks:**

- [ ] Collect shipping/billing address (from `addresses`)
- [ ] Choose payment method (M‑Pesa / Stripe)
- [ ] Review order summary (include coupon discount)
- [ ] Place order → creates `orders` (status = pending), `order_items`

### Epic 6.1: Payment Integration

#### Issue 6.1.1: Stripe Integration

**Labels:** `payment`, `stripe`
**Subtasks:**

- [ ] Stripe Checkout session
- [ ] Webhook to confirm payment → update `orders.payment_status = paid`, `orders.status = processing`
- [ ] Decrement product stock (with reservation logic)

#### Issue 6.1.2: M‑Pesa Integration (Daraja API)

**Labels:** `payment`, `mpesa`
**Subtasks:**

- [ ] STK Push to customer phone
- [ ] Query status, webhook callback
- [ ] Update `payments` and `orders` similarly

#### Issue 6.1.3: Post‑Payment Actions

**Labels:** `order`
**Subtasks:**

- [ ] Create `vendor_payouts` record (platform fee logic)
- [ ] Send order confirmation email + in‑app notification
- [ ] Redirect to order success page

---

## Phase 7: Social & Engagement Features

### Epic 7.0: Reviews & Ratings

#### Issue 7.0.1: Write a Review (Product & Shop)

**Labels:** `social`
**Subtasks:**

- [ ] After order completion, allow review on product and shop
- [ ] Rating 1‑5, comment, optional images
- [ ] Store in `reviews` table
- [ ] Update `products.average_rating` and `total_reviews`

#### Issue 7.0.2: Display Reviews & Aggregate

**Labels:** `frontend`
**Subtasks:**

- [ ] Shop details page: show average shop rating, total sales
- [ ] Product details page: list product reviews

### Epic 7.1: Biz Social Feed (Posts)

#### Issue 7.1.1: Create Post (Seller/Admin)

**Labels:** `social`, `feed`
**Subtasks:**

- [ ] POST `/api/shops/{shop}/posts` (text + images)
- [ ] Store in `posts` table

#### Issue 7.1.2: Feed – List Posts

**Labels:** `social`
**Subtasks:**

- [ ] GET `/api/feed` : posts from shops user follows or global
- [ ] Paginated, with likes, comments counts
- [ ] Display in “Community” or “Biz Feed” page

#### Issue 7.1.3: Like & Comment on Posts

**Labels:** `social`
**Subtasks:**

- [ ] Like toggle (post_likes unique constraint)
- [ ] Comment CRUD (nested via parent_id)

---

## Phase 8: Admin Panel & Super Admin Tools

### Epic 8.0: Admin Dashboard

#### Issue 8.0.1: View All Shops & Users

**Labels:** `admin`
**Subtasks:**

- [ ] List shops with filters (verified, active status)
- [ ] List users with role filter
- [ ] Suspend shop (`is_active = false`)
- [ ] Delete user (anonymize)

#### Issue 8.0.2: CRUD Shop / Product Categories

**Labels:** `admin`
**Subtasks:**

- [ ] UI for `shop_categories`
- [ ] UI for `product_categories` (nested)

#### Issue 8.0.3: View All Orders (Platform Level)

**Labels:** `admin`
**Subtasks:**

- [ ] Table of orders across all shops
- [ ] Filter by shop, date, status

### Epic 8.1: Super Admin

#### Issue 8.1.1: CRUD Admins

**Labels:** `super-admin`
**Subtasks:**

- [ ] Create/update/delete admin users (role = 2)
- [ ] Promote or demote roles

#### Issue 8.1.2: Audit Log Viewer

**Labels:** `super-admin`
**Subtasks:**

- [ ] Browse `audit_logs` table (filter by user, entity, action)

---

## Phase 9: Polish, Performance & Deployment

### Epic 9.0: UX Fixes

#### Issue 9.0.1: Smooth Toast Notifications

**Labels:** `bug`, `ux`
**Subtasks:**

- [ ] Replace native alert with Vue-toastification or similar
- [ ] Use event bus or composable for async actions

#### Issue 9.0.2: Loading States & Error Boundaries

**Labels:** `frontend`
**Subtasks:**

- [ ] Skeleton loaders for product lists
- [ ] Global error boundary for API failures

### Epic 9.1: Production Readiness

#### Issue 9.1.1: Performance Optimizations

**Labels:** `performance`
**Subtasks:**

- [ ] Implement caching for shop listings (Redis)
- [ ] Lazy‑load product images
- [ ] Optimize database indexes (use your migration index hints)

#### Issue 9.1.2: Security & CSRF

**Labels:** `security`
**Subtasks:**

- [ ] Ensure all state‑changing endpoints use CSRF protection
- [ ] Validate `X-Tenant-ID` or shop context for multi‑store isolation

#### Issue 9.1.3: Deployment & Monitoring

**Labels:** `devops`
**Subtasks:**

- [ ] Set up production environment (Forge / Vapor / Ploi)
- [ ] Configure Sentry for error tracking
- [ ] Set up backup for database and uploaded images

#### Issue 9.1.4: Documentation (for consultants / reusability)

**Labels:** `docs`
**Subtasks:**

- [ ] Write `README.md` with setup steps
- [ ] Document API endpoints (Postman collection or Swagger)
- [ ] Add this `KANBAN.md` file to the repo root

---

## How to Use This Kanban File

1. **Create a new GitHub repository** for your multi‑store ecommerce.
2. **Copy this entire file** into the repo as `KANBAN.md`.
3. **Go to GitHub Projects → New Project → Kanban.**
4. **Convert each “Issue” block** into a real GitHub Issue (title, labels, checklist).
5. **Work sequentially** – Phase 0 → Phase 1 → … Do not jump ahead.
6. **When you start over or deliver to a client**, this file becomes the reusable roadmap.
```

## INVENTORY MANAGEMENT - COMPLETE IMPLEMENTATION

> **Complete Implementation Guide** | 15 min read

### Key Operations to support

Incoming/Outgoing Movements:

- Stock Receipt - Adding stock (purchase orders, returns)
- Stock Deduction - Customer purchases, damages, theft
- Stock Adjustment - Manual corrections (cycle counts)
- Stock Transfer - Moving between locations/warehouses

Real-time Updates:

- Cart checkout → Reserve stock
- Payment confirmed → Deduct reserved stock
- Order cancelled → Release reserved stock
- Return processed → Add back to stock

### TABLE OF CONTENTS

1. [Migrations](#migrations)
1. [Models](#models)
1. [Services](#services)
1. [Exceptions](#exceptions)
1. [Controllers](#controllers)
1. [Console Commands](#console-commands)
1. [Middleware](#middleware)
1. [Vue Components & Pages](#vue-components--pages)
1. [Testing Checklist](#testing-checklist)
1. [Deployment Checklist](#deployment-checklist)

---

### Migrations

[↑ Back to top](#inventory-management---complete-implementation)

```bash
php artisan make:migration create_stock_ledgers_table
php artisan make:migration create_stock_movements_table
php artisan make:migration create_stock_reservations_table
php artisan make:migration add_inventory_columns_to_orders_table
php artisan make:migration add_stock_columns_to_products_table
php artisan make:migration create_stock_adjustments_table
```

```php
// stock_ledgers_table
Schema::create('stock_ledgers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->foreignId('shop_id')->constrained()->cascadeOnDelete();

    // The three buckets - core inventory tracking
    $table->integer('quantity_on_hand')->default(0); // Physical stock in warehouse
    $table->integer('quantity_allocated')->default(0); // Reserved for pending orders
    $table->integer('quantity_available')->default(0); // Available to sell (on hand - allocated)

    // Safety stock - min qty before alert triggers
    $table->integer('safety_stock')->default(5);

    // Cached stock status for fast filtering (updated automatically on any stock change)
    $table->enum('stock_status', ['in_stock', 'low_stock', 'out_of_stock'])->default('out_of_stock');

    // Audit timestamps
    $table->timestamp('last_counted_at')->nullable(); // Last physical count date
    $table->timestamps();

    $table->unique(['product_id', 'shop_id']);
    $table->index(['shop_id', 'stock_status']);
    $table->index(['quantity_available']);
    $table->index(['safety_stock']);
});

// stock movements (Complete Audit Trail)
Schema::create('stock_movements', function (Blueprint $table) {
    $table->id();
    $table->uuid()->unique();
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
    $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

    // Movement Type - describes what business event cause this stock change
    // - 'initial_stock',   // First time adding inventory to system
    // - 'purchase',        // Supplier purchase order received
    // - 'sale',           // Customer order placed
    // - 'return',         // Customer return received
    // - 'adjustment',     // Manual inventory correction (count discrepancy)
    // - 'write_off',      // Damaged, expired, or lost inventory
    // - 'restock'         // Regular supplier restock
    $table->enum('movement_type', ['initial_stock', 'purchase', 'sale', 'return', 'adjustment', 'write_off', 'restock']);

    // Quantity deatils with before/after snapshots
    $table->integer('quantity');
    $table->integer('quantity_before')->default(0);
    $table->integer('quantity_after')->default(0);

    // Polymorphic reference to what cause this movement
    $table->string('reference_type')->nullable(); // 'order', 'purchase', 'cart'

    $table->unsignedBigInteger('reference_id')->nullable(); // ID reference

    // Why this movement happened (human-readable)
    $table->text('reason')->nullable();

    // Additional metadata (e.g., {"batch_id": 123, "supplier": "ABC Corp"})
    $table->json('metadata')->nullable();

    $table->timestamps();

    $table->index(['product_id', 'movement_type']);
    $table->index(['reference_type', 'reference_id']);
    $table->index(['created_at']);
    $table->index(['shop_id', 'created_at']);
});

// stock reservations (7-Min Cart Holds)
Schema::create('stock_reservations', function (Blueprint $table) {
    $table->id();
    $table->uuid()->unique();

    // What product is reserved
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();

    // Who reserved it (logged in users only)
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

    // Session tracking for debugging
    $table->string('session_id')->nullable();

    // Link to cart system
    $table->foreignId('cart_id')->nullable()->constrained('carts')->cascadeOnDelete();

    // Reservation details
    $table->integer('quantity');
    $table->timestamp('expires_at'); // = NOW() + 7 minutes

    // Status workflow: active -> converted (to order), expired, or cancelled
    $table->enum('status', ['active', 'converted', 'expired', 'cancelled'])->default('active');
    $table->timestamps();

    $table->index(['user_id', 'status']);
    $table->index(['expires_at']);
    $table->index(['cart_id']);
    $table->index(['product_id', 'status']);

    $table->index(['status', 'expires_at']);
});

// stock adjustments (Manual changes by Admins)
Schema::create('stock_adjustments', function (Blueprint $table) {
    $table->id();
    $table->uuid()->unique();
    $table->string('adjustment_number')->unique();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('shop_id')->constrained();
    $table->foreignId('adjusted_by')->constrained('users');

    $table->integer('previous_quantity'); // Before adjustment
    $table->integer('new_quantity'); // After adjustment
    $table->integer('difference'); // new - previous (positive or negative)

    // - 'count_correction',   // Physical count mismatch
    // - 'damaged',           // Product damaged
    // - 'expired',           // Product expired
    // - 'restock',           // Adding more stock
    // - 'removal'            // Removing stock for any reason
    $table->enum('adjustment_type', ['count_correction', 'damaged', 'expired', 'restock', 'removal']);
    $table->text('reason')->nullable();
    $table->json('proof_images')->nullable(); // Array of image paths for damaged / expired
    $table->timestamps();

    $table->index(['product_id', 'created_at']);
    $table->index(['shop_id', 'adjustment_type']);
    $table->index(['adjustment_number']);
});
```

### Models

[↑ Back to top](#inventory-management---complete-implementation)

```php
<?php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    // ... existing code ...
    
    /**
     * Get the stock ledger for this product.
     * Each product has exactly ONE stock ledger per shop.
     */
    public function stockLedger(): HasOne
    {
        return $this->hasOne(StockLedger::class);
    }
    
    /**
     * Get all stock movements for this product.
     * Complete audit trail of every stock change.
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }
    
    /**
     * Get active stock reservations for this product.
     * Used to check what's currently in customers' carts.
     */
    public function activeReservations(): HasMany
    {
        return $this->hasMany(StockReservation::class)->where('status', 'active');
    }
    
    /**
     * Accessor: Get available stock count.
     * Example: $product->available_stock
     */
    public function getAvailableStockAttribute(): int
    {
        return $this->stockLedger?->quantity_available ?? 0;
    }
    
    /**
     * Accessor: Get formatted stock status with human-readable text.
     * Example: $product->stock_status_human -> "In Stock (45 available)"
     */
    public function getStockStatusHumanAttribute(): string
    {
        $ledger = $this->stockLedger;
        
        if (!$ledger || $ledger->quantity_available <= 0) {
            return 'Out of Stock';
        }
        
        if ($ledger->quantity_available <= $ledger->safety_stock) {
            return "Low Stock ({$ledger->quantity_available} left)";
        }
        
        return "In Stock ({$ledger->quantity_available} available)";
    }
    
    /**
     * Check if product can be purchased in the requested quantity.
     * Returns true if stock is available or backorders are allowed.
     */
    public function canPurchase(int $quantity): bool
    {
        if (!$this->track_inventory) {
            return true; // Inventory tracking disabled
        }
        
        if ($this->allow_backorders) {
            return true; // Backorders allowed
        }
        
        $available = $this->available_stock;
        
        return $available >= $quantity;
    }
    
    /**
     * Validate quantity against min/max order limits.
     * Returns error message or null if valid.
     */
    public function validateOrderQuantity(int $quantity): ?string
    {
        if ($quantity < $this->min_per_order) {
            return "Minimum order quantity is {$this->min_per_order}";
        }
        
        if ($this->max_per_order && $quantity > $this->max_per_order) {
            return "Maximum order quantity is {$this->max_per_order}";
        }
        
        if ($this->track_inventory && !$this->allow_backorders) {
            $available = $this->available_stock;
            if ($quantity > $available) {
                return "Only {$available} units available";
            }
        }
        
        return null;
    }
}


// StockLedger.php
<?php
// app/Models/StockLedger.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockLedger extends Model
{
    protected $table = 'stock_ledgers';
    
    protected $fillable = [
        'product_id',
        'shop_id',
        'quantity_on_hand',
        'quantity_allocated',
        'quantity_available',
        'safety_stock',
        'stock_status',
        'last_counted_at'
    ];
    
    protected $casts = [
        'quantity_on_hand' => 'integer',
        'quantity_allocated' => 'integer',
        'quantity_available' => 'integer',
        'safety_stock' => 'integer',
        'last_counted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    /**
     * Relationship: Product that this ledger tracks
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    /**
     * Relationship: Shop that owns this inventory
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }
    
    /**
     * Update the stock status based on current available quantity.
     * Called automatically after any stock change.
     */
    public function updateStockStatus(): void
    {
        if ($this->quantity_available <= 0) {
            $this->stock_status = 'out_of_stock';
        } elseif ($this->quantity_available <= $this->safety_stock) {
            $this->stock_status = 'low_stock';
        } else {
            $this->stock_status = 'in_stock';
        }
        
        $this->saveQuietly(); // Save without triggering events
    }
    
    /**
     * Recalculate available quantity (on_hand - allocated).
     * Returns the new available quantity.
     */
    public function recalculateAvailable(): int
    {
        $this->quantity_available = $this->quantity_on_hand - $this->quantity_allocated;
        $this->saveQuietly();
        $this->updateStockStatus();
        
        return $this->quantity_available;
    }
}

// StockMovement.php
<?php
// app/Models/StockMovement.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    protected $table = 'stock_movements';
    
    protected $fillable = [
        'product_id',
        'shop_id',
        'created_by',
        'movement_type',
        'quantity',
        'quantity_before',
        'quantity_after',
        'reference_type',
        'reference_id',
        'reason',
        'metadata'
    ];
    
    protected $casts = [
        'quantity' => 'integer',
        'quantity_before' => 'integer',
        'quantity_after' => 'integer',
        'reference_id' => 'integer',
        'metadata' => 'array',
        'created_at' => 'datetime'
    ];
    
    /**
     * Relationship: Product that was moved
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    /**
     * Relationship: User who performed the movement
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    /**
     * Polymorphic relationship to the reference (order, purchase_order, etc.)
     * Example: $movement->reference (returns Order model if reference_type = 'order')
     */
    public function reference()
    {
        return $this->morphTo();
    }
    
    /**
     * Scope: Get all movements for a specific shop
     */
    public function scopeForShop($query, int $shopId)
    {
        return $query->where('shop_id', $shopId);
    }
    
    /**
     * Scope: Get only sale movements
     */
    public function scopeSales($query)
    {
        return $query->where('movement_type', 'sale');
    }
}

//StockReservation.php
<?php
// app/Models/StockReservation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockReservation extends Model
{
    protected $table = 'stock_reservations';
    
    protected $fillable = [
        'product_id',
        'user_id',
        'session_id',
        'cart_id',
        'quantity',
        'expires_at',
        'status'
    ];
    
    protected $casts = [
        'quantity' => 'integer',
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    /**
     * Relationship: Product that is reserved
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    /**
     * Relationship: User who reserved the product
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Relationship: Cart that holds this reservation
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }
    
    /**
     * Check if reservation has expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
    
    /**
     * Cancel this reservation and release stock
     */
    public function cancel(): void
    {
        if ($this->status === 'active') {
            $this->status = 'cancelled';
            $this->save();
        }
    }
    
    /**
     * Scope: Get only active (not expired, not converted) reservations
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                     ->where('expires_at', '>', now());
    }
    
    /**
     * Scope: Get expired active reservations (ready for cleanup)
     */
    public function scopeExpiredActive($query)
    {
        return $query->where('status', 'active')
                     ->where('expires_at', '<', now());
    }
}

//Order.php
<?php
// app/Models/Order.php

namespace App\Models;

// Add this method to your existing Order model

class Order extends Model
{
    // ... existing code ...
    
    /**
     * Get all order items with their stock movement records.
     * Used to audit which stock was allocated to this order.
     */
    public function stockMovements()
    {
        return $this->morphMany(StockMovement::class, 'reference');
    }
    
    /**
     * Check if inventory has been allocated for this order.
     */
    public function isInventoryAllocated(): bool
    {
        return in_array($this->inventory_status, ['allocated', 'partially_shipped', 'shipped']);
    }
    
    /**
     * Mark order inventory as allocated.
     * Called after successful payment or order confirmation.
     */
    public function markInventoryAllocated(): void
    {
        if ($this->inventory_status === 'pending') {
            $this->inventory_status = 'allocated';
            $this->inventory_allocated_at = now();
            $this->saveQuietly();
        }
    }
}

// User.php
<?php
// app/Models/User.php

namespace App\Models;

// Add this relationship to your existing User model

class User extends Model
{
    // ... existing code ...
    
    /**
     * Get the user's cart (one cart per user per requirements)
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
    
    /**
     * Get active stock reservations for this user
     */
    public function activeStockReservations()
    {
        return $this->hasMany(StockReservation::class)->where('status', 'active');
    }
}
```

### Services

[↑ Back to top](#inventory-management---complete-implementation)

```php
//StockService.php (Core Business Logic)
<?php
// app/Services/Inventory/StockService.php

namespace App\Services\Inventory;

use App\Models\Product;
use App\Models\StockLedger;
use App\Models\StockMovement;
use App\Models\StockReservation;
use App\Models\StockAdjustment;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidStockOperationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StockService
{
    /**
     * CONSTANTS: Reservation expiry time in minutes
     * Set to 7 minutes as per requirements
     */
    const RESERVATION_EXPIRY_MINUTES = 7;
    
    /**
     * Get or create a stock ledger for a product.
     * Every product must have a ledger before any stock operations.
     *
     * @param Product $product
     * @return StockLedger
     */
    public function getOrCreateLedger(Product $product): StockLedger
    {
        return StockLedger::firstOrCreate(
            ['product_id' => $product->id, 'shop_id' => $product->shop_id],
            [
                'quantity_on_hand' => 0,
                'quantity_allocated' => 0,
                'quantity_available' => 0,
                'safety_stock' => 5,
                'stock_status' => 'out_of_stock'
            ]
        );
    }
    
    /**
     * Check if product has sufficient available stock.
     * Optionally exclude a specific reservation (for cart updates).
     *
     * @param Product $product
     * @param int $quantity
     * @param int|null $excludeReservationId
     * @return bool
     */
    public function hasSufficientStock(Product $product, int $quantity, ?int $excludeReservationId = null): bool
    {
        // If inventory tracking is disabled, always return true
        if (!$product->track_inventory) {
            return true;
        }
        
        // If backorders allowed, always return true
        if ($product->allow_backorders) {
            return true;
        }
        
        $ledger = $this->getOrCreateLedger($product);
        $available = $ledger->quantity_available;
        
        // If we're updating an existing reservation, add its quantity back to available
        if ($excludeReservationId) {
            $existingReservation = StockReservation::find($excludeReservationId);
            if ($existingReservation && $existingReservation->status === 'active') {
                $available += $existingReservation->quantity;
            }
        }
        
        return $available >= $quantity;
    }
    
    /**
     * Get available stock count for a product.
     *
     * @param Product $product
     * @return int
     */
    public function getAvailableStock(Product $product): int
    {
        if (!$product->track_inventory) {
            return PHP_INT_MAX; // Unlimited if not tracked
        }
        
        $ledger = $this->getOrCreateLedger($product);
        return $ledger->quantity_available;
    }
    
    /**
     * Reserve stock for a cart (7-minute hold).
     * Creates a reservation and updates the ledger allocation.
     *
     * @param Product $product
     * @param int $quantity
     * @param int $userId
     * @param int|null $cartId
     * @param string|null $sessionId
     * @return StockReservation
     * @throws InsufficientStockException
     */
    public function reserveStock(
        Product $product, 
        int $quantity, 
        int $userId, 
        ?int $cartId = null, 
        ?string $sessionId = null
    ): StockReservation {
        // Validate min/max order limits
        $validationError = $product->validateOrderQuantity($quantity);
        if ($validationError) {
            throw new InsufficientStockException($validationError);
        }
        
        // Check stock availability
        if (!$this->hasSufficientStock($product, $quantity)) {
            $available = $this->getAvailableStock($product);
            throw new InsufficientStockException(
                "Only {$available} units available for '{$product->name}'. " .
                "Please reduce your quantity."
            );
        }
        
        return DB::transaction(function () use ($product, $quantity, $userId, $cartId, $sessionId) {
            // Create reservation record
            $reservation = StockReservation::create([
                'product_id' => $product->id,
                'user_id' => $userId,
                'session_id' => $sessionId,
                'cart_id' => $cartId,
                'quantity' => $quantity,
                'expires_at' => now()->addMinutes(self::RESERVATION_EXPIRY_MINUTES),
                'status' => 'active'
            ]);
            
            // Update ledger: increase allocated stock
            $ledger = $this->getOrCreateLedger($product);
            $ledger->quantity_allocated += $quantity;
            $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
            $ledger->save();
            
            // Update stock status based on new available quantity
            $ledger->updateStockStatus();
            
            // Log the reservation for debugging
            Log::info("Stock reserved", [
                'product_id' => $product->id,
                'user_id' => $userId,
                'quantity' => $quantity,
                'reservation_id' => $reservation->id,
                'expires_at' => $reservation->expires_at
            ]);
            
            return $reservation;
        });
    }
    
    /**
     * Update an existing reservation quantity.
     * Used when user modifies cart item quantity.
     *
     * @param StockReservation $reservation
     * @param int $newQuantity
     * @return StockReservation
     * @throws InsufficientStockException
     */
    public function updateReservation(StockReservation $reservation, int $newQuantity): StockReservation
    {
        if ($reservation->status !== 'active') {
            throw new InvalidStockOperationException(
                "Cannot update reservation that is {$reservation->status}"
            );
        }
        
        if ($reservation->isExpired()) {
            throw new InvalidStockOperationException(
                "Reservation has expired. Please add to cart again."
            );
        }
        
        $product = $reservation->product;
        $oldQuantity = $reservation->quantity;
        $quantityDiff = $newQuantity - $oldQuantity;
        
        if ($quantityDiff === 0) {
            return $reservation;
        }
        
        if ($quantityDiff > 0) {
            // Need more stock - check availability
            $available = $this->getAvailableStock($product) + $oldQuantity; // Add back current reservation
            if ($available < $newQuantity) {
                throw new InsufficientStockException(
                    "Only {$available} units available for '{$product->name}'. " .
                    "Cannot increase to {$newQuantity}."
                );
            }
            
            // Update ledger: increase allocated by the difference
            $ledger = $this->getOrCreateLedger($product);
            $ledger->quantity_allocated += $quantityDiff;
            $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
            $ledger->save();
            $ledger->updateStockStatus();
            
        } else {
            // Reducing quantity - release some stock back to available
            $ledger = $this->getOrCreateLedger($product);
            $ledger->quantity_allocated += $quantityDiff; // quantityDiff is negative here
            $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
            $ledger->save();
            $ledger->updateStockStatus();
        }
        
        // Update reservation quantity
        $reservation->quantity = $newQuantity;
        $reservation->expires_at = now()->addMinutes(self::RESERVATION_EXPIRY_MINUTES); // Reset expiry
        $reservation->save();
        
        Log::info("Reservation updated", [
            'reservation_id' => $reservation->id,
            'old_quantity' => $oldQuantity,
            'new_quantity' => $newQuantity
        ]);
        
        return $reservation;
    }
    
    /**
     * Convert reservation to actual sale (when order is placed).
     * This permanently removes stock from inventory.
     *
     * @param StockReservation $reservation
     * @param int $orderId
     * @return void
     */
    public function convertReservationToSale(StockReservation $reservation, int $orderId): void
    {
        DB::transaction(function () use ($reservation, $orderId) {
            $product = $reservation->product;
            $ledger = $this->getOrCreateLedger($product);
            
            // Record the stock movement (audit trail)
            $this->recordMovement(
                product: $product,
                quantity: $reservation->quantity,
                movementType: 'sale',
                referenceType: 'order',
                referenceId: $orderId,
                reason: "Order #{$orderId} placed and paid",
                createdBy: $reservation->user_id
            );
            
            // Update ledger: reduce on_hand AND allocated
            $ledger->quantity_on_hand -= $reservation->quantity;
            $ledger->quantity_allocated -= $reservation->quantity;
            $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
            $ledger->save();
            
            // Update stock status
            $ledger->updateStockStatus();
            
            // Mark reservation as converted
            $reservation->status = 'converted';
            $reservation->save();
            
            Log::info("Reservation converted to sale", [
                'reservation_id' => $reservation->id,
                'order_id' => $orderId,
                'quantity' => $reservation->quantity,
                'remaining_stock' => $ledger->quantity_available
            ]);
        });
    }
    
    /**
     * Release expired reservations (run via scheduled job).
     * Returns the number of reservations released.
     *
     * @return int
     */
    public function releaseExpiredReservations(): int
    {
        $expiredReservations = StockReservation::expiredActive()->get();
        $releasedCount = 0;
        
        foreach ($expiredReservations as $reservation) {
            DB::transaction(function () use ($reservation, &$releasedCount) {
                $product = $reservation->product;
                $ledger = $this->getOrCreateLedger($product);
                
                // Return allocated stock to available
                $ledger->quantity_allocated -= $reservation->quantity;
                $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
                $ledger->save();
                
                // Update stock status
                $ledger->updateStockStatus();
                
                // Mark reservation as expired
                $reservation->status = 'expired';
                $reservation->save();
                
                $releasedCount++;
                
                Log::info("Expired reservation released", [
                    'reservation_id' => $reservation->id,
                    'product_id' => $product->id,
                    'quantity' => $reservation->quantity,
                    'released_at' => now()
                ]);
            });
        }
        
        if ($releasedCount > 0) {
            Log::info("Released {$releasedCount} expired reservations");
        }
        
        return $releasedCount;
    }
    
    /**
     * Release a specific reservation (e.g., when user removes from cart).
     *
     * @param StockReservation $reservation
     * @return void
     */
    public function releaseReservation(StockReservation $reservation): void
    {
        DB::transaction(function () use ($reservation) {
            $product = $reservation->product;
            $ledger = $this->getOrCreateLedger($product);
            
            // Return allocated stock to available
            $ledger->quantity_allocated -= $reservation->quantity;
            $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
            $ledger->save();
            
            $ledger->updateStockStatus();
            
            // Mark reservation as cancelled
            $reservation->status = 'cancelled';
            $reservation->save();
            
            Log::info("Reservation released", [
                'reservation_id' => $reservation->id,
                'reason' => 'user_action'
            ]);
        });
    }
    
    /**
     * Add initial stock to a product (first time setup).
     *
     * @param Product $product
     * @param int $quantity
     * @param int $createdBy
     * @return void
     */
    public function addInitialStock(Product $product, int $quantity, int $createdBy): void
    {
        DB::transaction(function () use ($product, $quantity, $createdBy) {
            $ledger = $this->getOrCreateLedger($product);
            
            // Record movement
            $this->recordMovement(
                product: $product,
                quantity: $quantity,
                movementType: 'initial_stock',
                referenceType: null,
                referenceId: null,
                reason: "Initial stock setup",
                createdBy: $createdBy
            );
            
            // Update ledger
            $ledger->quantity_on_hand += $quantity;
            $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
            $ledger->save();
            
            $ledger->updateStockStatus();
            
            Log::info("Initial stock added", [
                'product_id' => $product->id,
                'quantity' => $quantity,
                'created_by' => $createdBy
            ]);
        });
    }
    
    /**
     * Restock a product (purchase from supplier).
     *
     * @param Product $product
     * @param int $quantity
     * @param int $createdBy
     * @param string|null $referenceType
     * @param int|null $referenceId
     * @return void
     */
    public function restock(
        Product $product, 
        int $quantity, 
        int $createdBy, 
        ?string $referenceType = null, 
        ?int $referenceId = null
    ): void {
        DB::transaction(function () use ($product, $quantity, $createdBy, $referenceType, $referenceId) {
            $ledger = $this->getOrCreateLedger($product);
            
            $this->recordMovement(
                product: $product,
                quantity: $quantity,
                movementType: 'restock',
                referenceType: $referenceType,
                referenceId: $referenceId,
                reason: "Restock from supplier",
                createdBy: $createdBy
            );
            
            $ledger->quantity_on_hand += $quantity;
            $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
            $ledger->save();
            
            $ledger->updateStockStatus();
            
            Log::info("Product restocked", [
                'product_id' => $product->id,
                'quantity' => $quantity,
                'created_by' => $createdBy,
                'new_on_hand' => $ledger->quantity_on_hand
            ]);
        });
    }
    
    /**
     * Manual stock adjustment (admin action).
     * Records the adjustment with reason and proof.
     *
     * @param Product $product
     * @param int $newQuantity
     * @param int $adjustedBy
     * @param string $adjustmentType
     * @param string|null $reason
     * @param array|null $proofImages
     * @return StockAdjustment
     */
    public function manualAdjustment(
        Product $product,
        int $newQuantity,
        int $adjustedBy,
        string $adjustmentType,
        ?string $reason = null,
        ?array $proofImages = null
    ): StockAdjustment {
        return DB::transaction(function () use ($product, $newQuantity, $adjustedBy, $adjustmentType, $reason, $proofImages) {
            $ledger = $this->getOrCreateLedger($product);
            $previousQuantity = $ledger->quantity_on_hand;
            $difference = $newQuantity - $previousQuantity;
            
            // Create adjustment record
            $adjustment = StockAdjustment::create([
                'adjustment_number' => 'ADJ-' . strtoupper(uniqid()),
                'product_id' => $product->id,
                'shop_id' => $product->shop_id,
                'adjusted_by' => $adjustedBy,
                'previous_quantity' => $previousQuantity,
                'new_quantity' => $newQuantity,
                'difference' => $difference,
                'adjustment_type' => $adjustmentType,
                'reason' => $reason,
                'proof_images' => $proofImages
            ]);
            
            // Record movement
            $movementType = $difference > 0 ? 'restock' : 'write_off';
            $this->recordMovement(
                product: $product,
                quantity: abs($difference),
                movementType: $movementType,
                referenceType: 'adjustment',
                referenceId: $adjustment->id,
                reason: $reason ?? "Manual adjustment by admin",
                createdBy: $adjustedBy
            );
            
            // Update ledger
            $ledger->quantity_on_hand = $newQuantity;
            $ledger->quantity_available = $ledger->quantity_on_hand - $ledger->quantity_allocated;
            $ledger->save();
            
            $ledger->updateStockStatus();
            
            Log::info("Manual stock adjustment", [
                'product_id' => $product->id,
                'previous' => $previousQuantity,
                'new' => $newQuantity,
                'difference' => $difference,
                'adjustment_type' => $adjustmentType,
                'adjusted_by' => $adjustedBy
            ]);
            
            return $adjustment;
        });
    }
    
    /**
     * Record a stock movement (audit trail).
     * Internal method - use public methods above for business operations.
     *
     * @param Product $product
     * @param int $quantity
     * @param string $movementType
     * @param string|null $referenceType
     * @param int|null $referenceId
     * @param string|null $reason
     * @param int|null $createdBy
     * @return StockMovement
     */
    private function recordMovement(
        Product $product,
        int $quantity,
        string $movementType,
        ?string $referenceType,
        ?int $referenceId,
        ?string $reason,
        ?int $createdBy = null
    ): StockMovement {
        $ledger = $this->getOrCreateLedger($product);
        
        // Get before state
        $quantityBefore = $ledger->quantity_on_hand;
        
        // Calculate after state based on movement type
        $quantityAfter = $movementType === 'sale' || $movementType === 'write_off'
            ? $quantityBefore - $quantity
            : $quantityBefore + $quantity;
        
        return StockMovement::create([
            'product_id' => $product->id,
            'shop_id' => $product->shop_id,
            'created_by' => $createdBy,
            'movement_type' => $movementType,
            'quantity' => $quantity,
            'quantity_before' => $quantityBefore,
            'quantity_after' => $quantityAfter,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'reason' => $reason
        ]);
    }
}

//CartService (Integrates with stock service)
<?php
// app/Services/Cart/CartService.php

namespace App\Services\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\Inventory\StockService;
use App\Exceptions\InsufficientStockException;
use Illuminate\Support\Facades\DB;

class CartService
{
    protected $stockService;
    
    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }
    
    /**
     * Get or create cart for the authenticated user.
     * One cart per user per requirements.
     *
     * @param int $userId
     * @return Cart
     */
    public function getOrCreateCart(int $userId): Cart
    {
        return Cart::firstOrCreate(
            ['user_id' => $userId],
            [
                'session_id' => null, // No session needed since user is logged in
                'currency' => 'KES',
                'expires_at' => null // Permanent cart for logged-in users
            ]
        );
    }
    
    /**
     * Add item to cart with stock reservation.
     *
     * @param int $userId
     * @param Product $product
     * @param int $quantity
     * @return CartItem
     * @throws InsufficientStockException
     */
    public function addToCart(int $userId, Product $product, int $quantity): CartItem
    {
        return DB::transaction(function () use ($userId, $product, $quantity) {
            // Get or create cart
            $cart = $this->getOrCreateCart($userId);
            
            // Check if item already exists in cart
            $existingItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->whereNull('variant_id') // Simple products have no variant
                ->first();
            
            $finalQuantity = $existingItem ? $existingItem->quantity + $quantity : $quantity;
            
            // Reserve stock
            $reservation = $this->stockService->reserveStock(
                product: $product,
                quantity: $finalQuantity,
                userId: $userId,
                cartId: $cart->id,
                sessionId: null
            );
            
            // Create or update cart item
            if ($existingItem) {
                $existingItem->quantity = $finalQuantity;
                $existingItem->save();
                $cartItem = $existingItem;
            } else {
                $cartItem = CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'variant_id' => null,
                    'shop_id' => $product->shop_id,
                    'quantity' => $quantity
                ]);
            }
            
            // Store reservation ID on cart item (optional - for quick reference)
            $cartItem->stock_reservation_id = $reservation->id;
            $cartItem->save();
            
            return $cartItem;
        });
    }
    
    /**
     * Update cart item quantity.
     *
     * @param CartItem $cartItem
     * @param int $newQuantity
     * @return CartItem
     * @throws InsufficientStockException
     */
    public function updateCartItemQuantity(CartItem $cartItem, int $newQuantity): CartItem
    {
        if ($newQuantity <= 0) {
            return $this->removeFromCart($cartItem);
        }
        
        $reservation = $cartItem->stockReservation;
        
        if (!$reservation) {
            // No reservation exists - create one
            $reservation = $this->stockService->reserveStock(
                product: $cartItem->product,
                quantity: $newQuantity,
                userId: $cartItem->cart->user_id,
                cartId: $cartItem->cart_id
            );
            $cartItem->stock_reservation_id = $reservation->id;
        } else {
            // Update existing reservation
            $this->stockService->updateReservation($reservation, $newQuantity);
        }
        
        $cartItem->quantity = $newQuantity;
        $cartItem->save();
        
        return $cartItem;
    }
    
    /**
     * Remove item from cart and release reservation.
     *
     * @param CartItem $cartItem
     * @return CartItem
     */
    public function removeFromCart(CartItem $cartItem): CartItem
    {
        // Release stock reservation if exists
        if ($cartItem->stock_reservation_id) {
            $reservation = $cartItem->stockReservation;
            if ($reservation && $reservation->status === 'active') {
                $this->stockService->releaseReservation($reservation);
            }
        }
        
        $cartItem->delete();
        
        return $cartItem;
    }
    
    /**
     * Clear entire cart and release all reservations.
     *
     * @param int $userId
     * @return void
     */
    public function clearCart(int $userId): void
    {
        $cart = $this->getOrCreateCart($userId);
        
        foreach ($cart->items as $item) {
            $this->removeFromCart($item);
        }
    }
    
    /**
     * Get cart with stock status for each item.
     *
     * @param int $userId
     * @return Cart|null
     */
    public function getCartWithStockStatus(int $userId): ?Cart
    {
        $cart = $this->getOrCreateCart($userId);
        
        // Load items with products and stock info
        $cart->load(['items.product.stockLedger']);
        
        // Add stock status to each item
        foreach ($cart->items as $item) {
            $item->available_stock = $this->stockService->getAvailableStock($item->product);
            $item->is_sufficient_stock = $this->stockService->hasSufficientStock(
                $item->product, 
                $item->quantity
            );
        }
        
        return $cart;
    }
}
```

### Exceptions

[↑ Back to top](#inventory-management---complete-implementation)

```php
<?php
// app/Exceptions/InsufficientStockException.php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    /**
     * Render the exception as an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function render($request)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => $this->getMessage(),
                'error' => 'insufficient_stock',
                'code' => 422
            ], 422);
        }
        
        // For Inertia.js requests
        if ($request->inertia()) {
            return back()->with('error', $this->getMessage());
        }
        
        return redirect()->back()
            ->with('error', $this->getMessage())
            ->withInput();
    }
}

<?php
// app/Exceptions/InvalidStockOperationException.php

namespace App\Exceptions;

use Exception;

class InvalidStockOperationException extends Exception
{
    public function render($request)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => $this->getMessage(),
                'error' => 'invalid_stock_operation',
                'code' => 422
            ], 422);
        }
        
        if ($request->inertia()) {
            return back()->with('error', $this->getMessage());
        }
        
        return redirect()->back()
            ->with('error', $this->getMessage())
            ->withInput();
    }
}
```

### Controllers

[↑ Back to top](#inventory-management---complete-implementation)

```php
// Cart Controller
<?php
// app/Http/Controllers/Guest/CartController.php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\CartItem;
use App\Services\Cart\CartService;
use App\Services\Inventory\StockService;
use App\Exceptions\InsufficientStockException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;
    protected $stockService;
    
    public function __construct(CartService $cartService, StockService $stockService)
    {
        $this->cartService = $cartService;
        $this->stockService = $stockService;
    }
    
    /**
     * Display the cart page.
     */
    public function index()
    {
        $cart = $this->cartService->getCartWithStockStatus(auth()->id());
        
        return Inertia::render('guest/cart/Index', [
            'cart' => $cart,
            'cartItems' => $cart->items ?? [],
            'subtotal' => $this->calculateSubtotal($cart),
        ]);
    }
    
    /**
     * Add product to cart.
     */
    public function add(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        
        try {
            $cartItem = $this->cartService->addToCart(
                userId: auth()->id(),
                product: $product,
                quantity: $request->quantity
            );
            
            return redirect()->back()->with('success', 'Product added to cart!');
            
        } catch (InsufficientStockException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    
    /**
     * Update cart item quantity.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // Authorize that this cart item belongs to the logged-in user
        if ($cartItem->cart->user_id !== auth()->id()) {
            abort(403);
        }
        
        $request->validate([
            'quantity' => 'required|integer|min:0'
        ]);
        
        try {
            if ($request->quantity <= 0) {
                $this->cartService->removeFromCart($cartItem);
                $message = 'Item removed from cart';
            } else {
                $this->cartService->updateCartItemQuantity($cartItem, $request->quantity);
                $message = 'Cart updated';
            }
            
            return redirect()->back()->with('success', $message);
            
        } catch (InsufficientStockException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    
    /**
     * Remove item from cart.
     */
    public function remove(CartItem $cartItem)
    {
        if ($cartItem->cart->user_id !== auth()->id()) {
            abort(403);
        }
        
        $this->cartService->removeFromCart($cartItem);
        
        return redirect()->back()->with('success', 'Item removed from cart');
    }
    
    /**
     * Clear entire cart.
     */
    public function clear()
    {
        $this->cartService->clearCart(auth()->id());
        
        return redirect()->back()->with('success', 'Cart cleared');
    }
    
    /**
     * Calculate cart subtotal.
     */
    private function calculateSubtotal($cart): float
    {
        $subtotal = 0;
        
        if ($cart && $cart->items) {
            foreach ($cart->items as $item) {
                $subtotal += $item->quantity * $item->product->price;
            }
        }
        
        return $subtotal;
    }
}

// Checkout Controller
<?php
// app/Http/Controllers/Guest/CheckoutController.php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StockReservation;
use App\Services\Cart\CartService;
use App\Services\Inventory\StockService;
use App\Exceptions\InsufficientStockException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected $cartService;
    protected $stockService;
    
    public function __construct(CartService $cartService, StockService $stockService)
    {
        $this->cartService = $cartService;
        $this->stockService = $stockService;
    }
    
    /**
     * Show checkout page.
     */
    public function index()
    {
        $cart = $this->cartService->getCartWithStockStatus(auth()->id());
        
        // Verify all cart items have sufficient stock
        $insufficientItems = [];
        foreach ($cart->items as $item) {
            if (!$item->is_sufficient_stock) {
                $insufficientItems[] = [
                    'name' => $item->product->name,
                    'requested' => $item->quantity,
                    'available' => $item->available_stock
                ];
            }
        }
        
        if (count($insufficientItems) > 0) {
            return redirect()->route('cart.index')
                ->with('error', 'Some items in your cart no longer have sufficient stock. Please review your cart.');
        }
        
        return Inertia::render('guest/checkout/Index', [
            'cart' => $cart,
            'cartItems' => $cart->items,
            'subtotal' => $this->calculateSubtotal($cart)
        ]);
    }
    
    /**
     * Process checkout and create order.
     */
    public function process(Request $request)
    {
        $request->validate([
            'shipping_address_id' => 'required|exists:addresses,id',
            'billing_address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|integer'
        ]);
        
        $cart = $this->cartService->getCartWithStockStatus(auth()->id());
        
        // Final stock verification before order creation
        foreach ($cart->items as $item) {
            if (!$this->stockService->hasSufficientStock($item->product, $item->quantity)) {
                throw new InsufficientStockException(
                    "{$item->product->name} is no longer available in the requested quantity."
                );
            }
        }
        
        return DB::transaction(function () use ($request, $cart) {
            // Create order
            $orderNumber = 'ORD-' . strtoupper(uniqid());
            $subtotal = $this->calculateSubtotal($cart);
            
            $order = Order::create([
                'order_number' => $orderNumber,
                'subtotal' => $subtotal,
                'discount_amount' => 0,
                'shipping_cost' => 0,
                'tax_amount' => 0,
                'total_amount' => $subtotal,
                'status' => 0, // pending
                'payment_method' => $request->payment_method,
                'payment_status' => 0, // pending
                'shop_id' => $cart->items->first()->shop_id, // Assuming single shop per cart for V1
                'shipping_address_id' => $request->shipping_address_id,
                'billing_address_id' => $request->billing_address_id,
                'customer_id' => auth()->id(),
                'inventory_status' => 'pending'
            ]);
            
            // Create order items and convert reservations
            foreach ($cart->items as $cartItem) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'variant_id' => null,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->product->price,
                    'discount' => 0,
                    'total_price' => $cartItem->quantity * $cartItem->product->price,
                    'product_name_snapshot' => $cartItem->product->name,
                    'product_sku_snapshot' => $cartItem->product->sku,
                    'product_variant_snapshot' => null
                ]);
                
                // Convert reservation to actual sale
                $reservation = $cartItem->stockReservation;
                if ($reservation && $reservation->status === 'active') {
                    $this->stockService->convertReservationToSale($reservation, $order->id);
                }
            }
            
            // Clear the cart
            $this->cartService->clearCart(auth()->id());
            
            // Redirect to order confirmation
            return redirect()->route('orders.show', $order)
                ->with('success', 'Order placed successfully!');
        });
    }
    
    private function calculateSubtotal($cart): float
    {
        $subtotal = 0;
        foreach ($cart->items as $item) {
            $subtotal += $item->quantity * $item->product->price;
        }
        return $subtotal;
    }
}

// Product Controller (Add stock methods)
<?php
// Add these methods to your existing ProductController

namespace App\Http\Controllers\Guest;

// Add this import at the top
use App\Services\Inventory\StockService;
use App\Models\StockLedger;

class ProductController extends Controller
{
    protected $stockService;
    
    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }
    
    /**
     * Get stock information for a product (AJAX endpoint)
     */
    public function getStock(Product $product)
    {
        $available = $this->stockService->getAvailableStock($product);
        $ledger = $this->stockService->getOrCreateLedger($product);
        
        return response()->json([
            'available' => $available,
            'status' => $ledger->stock_status,
            'safety_stock' => $ledger->safety_stock,
            'on_hand' => $ledger->quantity_on_hand,
            'allocated' => $ledger->quantity_allocated,
            'has_sufficient' => $this->stockService->hasSufficientStock($product, 1)
        ]);
    }
    
    /**
     * Show product with stock information
     */
    public function show(Product $product)
    {
        // Load stock ledger with the product
        $product->load('stockLedger');
        
        $availableStock = $this->stockService->getAvailableStock($product);
        
        return Inertia::render('guest/products/Show', [
            'product' => $product,
            'available_stock' => $availableStock,
            'stock_status' => $product->stock_status_human
        ]);
    }
}

// Admin / Inventory Controller (For custom admin panel)
<?php
// app/Http/Controllers/Admin/InventoryController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Services\Inventory\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    protected $stockService;
    
    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }
    
    /**
     * Show inventory management page (similar to your discounts page).
     */
    public function index(Shop $shop)
    {
        // Get products with their stock ledgers
        $products = Product::where('shop_id', $shop->id)
            ->with('stockLedger')
            ->paginate(20);
        
        return Inertia::render('my-shops/inventory/Index', [
            'shop' => $shop,
            'products' => $products,
            'filters' => request()->only(['search', 'stock_status'])
        ]);
    }
    
    /**
     * Show form to adjust stock for a specific product.
     */
    public function edit(Shop $shop, Product $product)
    {
        $product->load('stockLedger');
        $ledger = $this->stockService->getOrCreateLedger($product);
        
        return Inertia::render('my-shops/inventory/Edit', [
            'shop' => $shop,
            'product' => $product,
            'stockLedger' => $ledger
        ]);
    }
    
    /**
     * Update stock (manual adjustment).
     */
    public function update(Request $request, Shop $shop, Product $product)
    {
        $request->validate([
            'new_quantity' => 'required|integer|min:0',
            'adjustment_type' => 'required|in:count_correction,damaged,expired,restock,removal',
            'reason' => 'nullable|string|max:500',
            'proof_images' => 'nullable|array'
        ]);
        
        $adjustment = $this->stockService->manualAdjustment(
            product: $product,
            newQuantity: $request->new_quantity,
            adjustedBy: auth()->id(),
            adjustmentType: $request->adjustment_type,
            reason: $request->reason,
            proofImages: $request->proof_images
        );
        
        return redirect()->route('my-shops.inventory.index', $shop->slug)
            ->with('success', 'Stock updated successfully');
    }
    
    /**
     * Bulk restock products (CSV upload or form).
     */
    public function bulkRestock(Request $request, Shop $shop)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);
        
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            $this->stockService->restock(
                product: $product,
                quantity: $item['quantity'],
                createdBy: auth()->id(),
                referenceType: 'bulk_restock',
                referenceId: null
            );
        }
        
        return redirect()->back()->with('success', 'Bulk restock completed');
    }
    
    /**
     * View stock movement history for a product.
     */
    public function history(Shop $shop, Product $product)
    {
        $movements = $product->stockMovements()
            ->with('createdBy')
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        
        return Inertia::render('my-shops/inventory/History', [
            'shop' => $shop,
            'product' => $product,
            'movements' => $movements
        ]);
    }
}
```

### Console Commands

[↑ Back to top](#inventory-management---complete-implementation)

Console Commands (Scheduler)

```php
// Command to release Expired Reservations

<?php
// app/Console/Commands/ReleaseExpiredReservations.php

namespace App\Console\Commands;

use App\Services\Inventory\StockService;
use Illuminate\Console\Command;

class ReleaseExpiredReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:release-expired-reservations 
                            {--batch-size=100 : Number of reservations to process per batch}
                            {--dry-run : Simulate without actually releasing}';
    
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Release expired stock reservations (carts abandoned for more than 7 minutes)';
    
    /**
     * Execute the console command.
     */
    public function handle(StockService $stockService)
    {
        $this->info('Starting expired reservation cleanup...');
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No actual changes will be made');
        }
        
        $releasedCount = $dryRun ? $this->countExpired() : $stockService->releaseExpiredReservations();
        
        $this->info("Released {$releasedCount} expired reservations");
        
        if ($dryRun) {
            $this->info("To actually release, run: php artisan inventory:release-expired-reservations");
        }
        
        return Command::SUCCESS;
    }
    
    private function countExpired(): int
    {
        return \App\Models\StockReservation::expiredActive()->count();
    }
}

// Command to initialize stock for existing products
<?php
// app/Console/Commands/InitializeProductStock.php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\Inventory\StockService;
use Illuminate\Console\Command;

class InitializeProductStock extends Command
{
    protected $signature = 'inventory:initialize-stock 
                            {--product-id= : Initialize stock for specific product only}
                            {--default-stock=0 : Default stock quantity for products without stock}';
    
    protected $description = 'Create stock ledgers for existing products';
    
    public function handle(StockService $stockService)
    {
        $query = Product::query();
        
        if ($this->option('product-id')) {
            $query->where('id', $this->option('product-id'));
        }
        
        $products = $query->get();
        $defaultStock = (int) $this->option('default-stock');
        
        $this->info("Processing {$products->count()} products...");
        
        $created = 0;
        foreach ($products as $product) {
            $ledger = $stockService->getOrCreateLedger($product);
            
            if ($ledger->wasRecentlyCreated && $defaultStock > 0) {
                $stockService->addInitialStock($product, $defaultStock, 1); // user_id 1 = system
                $this->line("✓ Created ledger for {$product->name} with {$defaultStock} units");
            } elseif ($ledger->wasRecentlyCreated) {
                $this->line("✓ Created ledger for {$product->name} (0 stock)");
            } else {
                $this->line("⏭ Ledger already exists for {$product->name}");
            }
            $created++;
        }
        
        $this->info("Completed. {$created} ledgers processed.");
        
        return Command::SUCCESS;
    }
}

// Register Commands in Kernel.php
<?php
// app/Console/Kernel.php

protected $commands = [
    \App\Console\Commands\ReleaseExpiredReservations::class,
    \App\Console\Commands\InitializeProductStock::class,
];

protected function schedule(Schedule $schedule)
{
    // Release expired reservations every minute (7-minute hold requirement)
    $schedule->command('inventory:release-expired-reservations')
             ->everyMinute()
             ->withoutOverlapping()
             ->appendOutputTo(storage_path('logs/inventory-cleanup.log'));
    
    // Daily stock status report (optional)
    $schedule->command('inventory:check-low-stock')->dailyAt('08:00');
}

// Low stock notification command (Bonus)
<?php
// app/Console/Commands/CheckLowStock.php

namespace App\Console\Commands;

use App\Models\StockLedger;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckLowStock extends Command
{
    protected $signature = 'inventory:check-low-stock';
    protected $description = 'Check for low stock products and send alerts';
    
    public function handle()
    {
        $lowStockProducts = StockLedger::where('stock_status', 'low_stock')
            ->with('product')
            ->get();
        
        if ($lowStockProducts->count() > 0) {
            Log::warning('Low stock alert', [
                'count' => $lowStockProducts->count(),
                'products' => $lowStockProducts->map(function ($ledger) {
                    return [
                        'name' => $ledger->product->name,
                        'available' => $ledger->quantity_available,
                        'safety_stock' => $ledger->safety_stock
                    ];
                })
            ]);
            
            $this->table(
                ['Product', 'Available', 'Safety Stock', 'Shop'],
                $lowStockProducts->map(fn($l) => [
                    $l->product->name,
                    $l->quantity_available,
                    $l->safety_stock,
                    $l->shop_id
                ])
            );
        } else {
            $this->info('No low stock products found');
        }
        
        return Command::SUCCESS;
    }
}
```

### Middleware

[↑ Back to top](#inventory-management---complete-implementation)

Real-time Stock Check

```php
// Stock Verification Middleware

<?php
// app/Http/Middleware/VerifyCartStock.php

namespace App\Http\Middleware;

use App\Services\Cart\CartService;
use App\Services\Inventory\StockService;
use Closure;
use Illuminate\Http\Request;

class VerifyCartStock
{
    protected $cartService;
    protected $stockService;
    
    public function __construct(CartService $cartService, StockService $stockService)
    {
        $this->cartService = $cartService;
        $this->stockService = $stockService;
    }
    
    /**
     * Verify that all items in cart still have sufficient stock before checkout.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check()) {
            $cart = $this->cartService->getCartWithStockStatus(auth()->id());
            
            $insufficientItems = [];
            foreach ($cart->items as $item) {
                if (!$this->stockService->hasSufficientStock($item->product, $item->quantity)) {
                    $insufficientItems[] = [
                        'name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'available' => $this->stockService->getAvailableStock($item->product)
                    ];
                }
            }
            
            if (count($insufficientItems) > 0) {
                return redirect()->route('cart.index')
                    ->with('error', 'Some items in your cart are no longer available in the requested quantity.')
                    ->with('insufficient_items', $insufficientItems);
            }
        }
        
        return $next($request);
    }
}

// Register Middleware in Kernel.php
// app/Http/Kernel.php
protected $routeMiddleware = [
    // ... other middleware
    'verify.stock' => \App\Http\Middleware\VerifyCartStock::class,
];

// Apply Middleware to Checkout Routes
// routes/web.php
Route::middleware(['auth', 'verify.stock'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');
});
```

### Vue Components & Pages

[↑ Back to top](#inventory-management---complete-implementation)

```vue
<!-- Cart Page with Stock Status -->
<!-- resources/js/pages/guest/cart/Index.vue -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import GuestLayout from '@/layouts/GuestLayout.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { Trash2, AlertCircle } from 'lucide-vue-next';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image_url: string;
    };
    available_stock: number;
    is_sufficient_stock: boolean;
}

const props = defineProps<{
    cart: any;
    cartItems: CartItem[];
    subtotal: number;
}>();

const updatingItems = ref<number[]>([]);

const updateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) {
        removeItem(item);
        return;
    }
    
    if (newQuantity > item.available_stock) {
        alert(`Only ${item.available_stock} units available`);
        return;
    }
    
    updatingItems.value.push(item.id);
    
    router.put(route('cart.update', { cartItem: item.id }), {
        quantity: newQuantity
    }, {
        preserveScroll: true,
        onFinish: () => {
            updatingItems.value = updatingItems.value.filter(id => id !== item.id);
        }
    });
};

const removeItem = (item: CartItem) => {
    if (confirm('Remove this item from cart?')) {
        router.delete(route('cart.remove', { cartItem: item.id }), {
            preserveScroll: true
        });
    }
};

const clearCart = () => {
    if (confirm('Clear your entire cart?')) {
        router.delete(route('cart.clear'));
    }
};

const hasInsufficientStock = computed(() => {
    return props.cartItems.some(item => !item.is_sufficient_stock);
});

const cartTotal = computed(() => {
    return props.subtotal;
});

const canCheckout = computed(() => {
    return props.cartItems.length > 0 && !hasInsufficientStock.value;
});
</script>

<template>
    <GuestLayout>
        <div class="cart-page max-w-4xl mx-auto py-8 px-4">
            <h1 class="text-2xl font-bold mb-6">Shopping Cart</h1>
            
            <!-- Insufficient Stock Warning -->
            <div v-if="hasInsufficientStock" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div class="flex items-center gap-2 text-red-600 mb-2">
                    <AlertCircle class="w-5 h-5" />
                    <span class="font-semibold">Stock Issues Detected</span>
                </div>
                <p class="text-red-600 text-sm">
                    Some items in your cart no longer have sufficient stock. 
                    Please update quantities or remove these items before checkout.
                </p>
            </div>
            
            <!-- Empty Cart -->
            <div v-if="cartItems.length === 0" class="text-center py-12">
                <p class="text-gray-500 mb-4">Your cart is empty</p>
                <Link href="/" class="text-blue-600 hover:underline">Continue Shopping</Link>
            </div>
            
            <!-- Cart Items -->
            <div v-else class="space-y-4">
                <div v-for="item in cartItems" 
                     :key="item.id"
                     class="flex gap-4 p-4 bg-white rounded-lg shadow-sm border"
                     :class="{ 'border-red-300 bg-red-50': !item.is_sufficient_stock }">
                    
                    <!-- Product Image -->
                    <img :src="item.product.image_url" 
                         :alt="item.product.name"
                         class="w-24 h-24 object-cover rounded">
                    
                    <!-- Product Info -->
                    <div class="flex-1">
                        <h3 class="font-semibold">{{ item.product.name }}</h3>
                        <p class="text-gray-600">KES {{ item.product.price.toLocaleString() }}</p>
                        
                        <!-- Stock Status -->
                        <div v-if="!item.is_sufficient_stock" class="text-red-600 text-sm mt-1">
                            Only {{ item.available_stock }} available
                        </div>
                        <div v-else-if="item.available_stock <= 5" class="text-orange-600 text-sm mt-1">
                            Only {{ item.available_stock }} left!
                        </div>
                    </div>
                    
                    <!-- Quantity Controls -->
                    <div class="flex items-center gap-2">
                        <button @click="updateQuantity(item, item.quantity - 1)"
                                :disabled="updatingItems.includes(item.id)"
                                class="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50">
                            -
                        </button>
                        <span class="w-12 text-center">{{ item.quantity }}</span>
                        <button @click="updateQuantity(item, item.quantity + 1)"
                                :disabled="updatingItems.includes(item.id) || item.quantity >= item.available_stock"
                                class="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50">
                            +
                        </button>
                    </div>
                    
                    <!-- Item Total & Remove -->
                    <div class="text-right">
                        <div class="font-semibold">
                            KES {{ (item.quantity * item.product.price).toLocaleString() }}
                        </div>
                        <button @click="removeItem(item)" 
                                class="text-red-500 text-sm hover:text-red-700 mt-2">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                <!-- Cart Summary -->
                <div class="border-t pt-4 mt-4">
                    <div class="flex justify-between text-lg font-semibold mb-4">
                        <span>Total:</span>
                        <span>KES {{ cartTotal.toLocaleString() }}</span>
                    </div>
                    
                    <div class="flex gap-3 justify-end">
                        <button @click="clearCart" 
                                class="px-4 py-2 border rounded hover:bg-gray-50">
                            Clear Cart
                        </button>
                        
                        <Link href="/checkout" 
                              :class="{
                                  'px-6 py-2 rounded text-white transition': true,
                                  'bg-blue-600 hover:bg-blue-700': canCheckout,
                                  'bg-gray-400 cursor-not-allowed pointer-events-none': !canCheckout
                              }">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>

<!-- Inventory management Page (Admin) -->
<!-- resources/js/pages/my-shops/inventory/Index.vue -->

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Head, Link, router } from '@inertiajs/vue3';
import { Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-vue-next';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/custom/Pagination.vue';
import myShopsRoutes from '@/routes/my-shops';
import myShopProductsRoutes from '@/routes/my-shops/products';

interface StockLedger {
    quantity_on_hand: number;
    quantity_allocated: number;
    quantity_available: number;
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
    safety_stock: number;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock_ledger: StockLedger | null;
}

const props = defineProps<{
    shop: { id: number; name: string; slug: string };
    products: { data: Product[]; meta: any };
    filters: { search?: string; stock_status?: string };
}>();

const search = ref(props.filters?.search || '');
const stockStatusFilter = ref(props.filters?.stock_status || '');

const debouncedSearch = useDebounceFn(() => {
    router.get(route('my-shops.inventory.index', props.shop.slug), {
        search: search.value,
        stock_status: stockStatusFilter.value
    }, {
        preserveState: true,
        replace: true
    });
}, 300);

watch([search, stockStatusFilter], () => {
    debouncedSearch();
});

const getStockBadge = (status: string) => {
    const badges = {
        in_stock: { class: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'In Stock' },
        low_stock: { class: 'bg-orange-100 text-orange-800', icon: AlertTriangle, text: 'Low Stock' },
        out_of_stock: { class: 'bg-red-100 text-red-800', icon: XCircle, text: 'Out of Stock' }
    };
    return badges[status as keyof typeof badges] || badges.out_of_stock;
};

const getProgressWidth = (product: Product) => {
    const ledger = product.stock_ledger;
    if (!ledger || ledger.quantity_available <= 0) return '0%';
    const maxStock = ledger.quantity_on_hand + ledger.quantity_allocated;
    if (maxStock === 0) return '0%';
    const percentage = (ledger.quantity_available / maxStock) * 100;
    return `${Math.min(percentage, 100)}%`;
};
</script>

<template>
    <Head title="Inventory Management" />

    <div class="app-container">
        <div class="header">
            <div class="info">
                <h1 class="title">{{ shop.name }} - Inventory</h1>
                <p class="description">Manage stock levels for all products</p>
            </div>

            <div class="filters">
                <Input
                    v-model="search"
                    type="text"
                    placeholder="Search products..."
                    class="w-64"
                />
                
                <select v-model="stockStatusFilter" class="border rounded px-3 py-2">
                    <option value="">All Status</option>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                </select>
                
                <Link :href="route('my-shops.inventory.bulk', shop.slug)">
                    <Button variant="outline">Bulk Actions</Button>
                </Link>
            </div>
        </div>

        <div class="table-wrapper">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>On Hand</TableHead>
                        <TableHead>Allocated</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead class="actions">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow v-for="product in products.data" :key="product.id">
                        <TableCell class="font-medium">{{ product.name }}</TableCell>
                        <TableCell class="text-sm text-gray-500">{{ product.sku || 'N/A' }}</TableCell>
                        <TableCell>
                            <div v-if="product.stock_ledger" 
                                 :class="getStockBadge(product.stock_ledger.stock_status).class"
                                 class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
                                <component :is="getStockBadge(product.stock_ledger.stock_status).icon" class="w-3 h-3" />
                                {{ getStockBadge(product.stock_ledger.stock_status).text }}
                            </div>
                            <div v-else class="text-gray-400 text-sm">Not tracked</div>
                        </TableCell>
                        <TableCell>{{ product.stock_ledger?.quantity_on_hand || 0 }}</TableCell>
                        <TableCell>{{ product.stock_ledger?.quantity_allocated || 0 }}</TableCell>
                        <TableCell class="font-semibold">
                            {{ product.stock_ledger?.quantity_available || 0 }}
                        </TableCell>
                        <TableCell class="w-32">
                            <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div class="bg-blue-600 h-2 rounded-full transition-all"
                                     :style="{ width: getProgressWidth(product) }">
                                </div>
                            </div>
                        </TableCell>
                        <TableCell class="actions">
                            <Link :href="route('my-shops.inventory.edit', {shop: shop.slug, product: product.id})"
                                  class="text-blue-600 hover:text-blue-800 text-sm">
                                Adjust Stock
                            </Link>
                        </TableCell>
                    </TableRow>
                    
                    <TableRow v-if="products.data.length === 0">
                        <TableCell colspan="8" class="text-center py-8 text-gray-500">
                            No products found
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <Pagination :meta="products.meta" />
    </div>
</template>

<!-- Stock Adjustment Form (Admin) -->
<!-- resources/js/pages/my-shops/inventory/Edit.vue -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import GuestLayout from '@/layouts/GuestLayout.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';

const props = defineProps<{
    shop: { id: number; name: string; slug: string };
    product: {
        id: number;
        name: string;
        sku: string;
        price: number;
    };
    stockLedger: {
        quantity_on_hand: number;
        quantity_allocated: number;
        quantity_available: number;
        safety_stock: number;
    };
}>();

const form = useForm({
    new_quantity: props.stockLedger.quantity_on_hand,
    adjustment_type: 'count_correction',
    reason: '',
    proof_images: []
});

const adjustmentTypes = [
    { value: 'count_correction', label: 'Count Correction (Physical count mismatch)' },
    { value: 'restock', label: 'Restock (New shipment received)' },
    { value: 'damaged', label: 'Damaged Product' },
    { value: 'expired', label: 'Expired Product' },
    { value: 'removal', label: 'Removal (Other reasons)' }
];

const difference = computed(() => {
    return form.new_quantity - props.stockLedger.quantity_on_hand;
});

const isIncreasing = computed(() => difference.value > 0);
const isDecreasing = computed(() => difference.value < 0);

const submit = () => {
    form.put(route('my-shops.inventory.update', {
        shop: props.shop.slug,
        product: props.product.id
    }), {
        preserveScroll: true,
        onSuccess: () => {
            // Redirect back to inventory list
            router.visit(route('my-shops.inventory.index', props.shop.slug));
        }
    });
};
</script>

<template>
    <Head :title="`Adjust Stock - ${product.name}`" />

    <div class="max-w-2xl mx-auto py-8 px-4">
        <div class="mb-6">
            <Link :href="route('my-shops.inventory.index', shop.slug)" 
                  class="text-blue-600 hover:underline text-sm">
                ← Back to Inventory
            </Link>
            <h1 class="text-2xl font-bold mt-2">Adjust Stock: {{ product.name }}</h1>
            <p class="text-gray-500">SKU: {{ product.sku || 'N/A' }} | Price: KES {{ product.price.toLocaleString() }}</p>
        </div>
        
        <!-- Current Stock Summary -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-3 gap-4">
            <div>
                <div class="text-sm text-gray-500">On Hand</div>
                <div class="text-2xl font-bold">{{ stockLedger.quantity_on_hand }}</div>
            </div>
            <div>
                <div class="text-sm text-gray-500">Allocated (in carts)</div>
                <div class="text-2xl font-bold">{{ stockLedger.quantity_allocated }}</div>
            </div>
            <div>
                <div class="text-sm text-gray-500">Available to Sell</div>
                <div class="text-2xl font-bold" :class="{
                    'text-green-600': stockLedger.quantity_available > 0,
                    'text-red-600': stockLedger.quantity_available === 0
                }">
                    {{ stockLedger.quantity_available }}
                </div>
            </div>
        </div>
        
        <!-- Adjustment Form -->
        <form @submit.prevent="submit" class="space-y-6 bg-white rounded-lg shadow-sm p-6">
            <div>
                <label class="block text-sm font-medium mb-1">Adjustment Type *</label>
                <select v-model="form.adjustment_type" 
                        class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                    <option v-for="type in adjustmentTypes" :key="type.value" :value="type.value">
                        {{ type.label }}
                    </option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">New Quantity (On Hand) *</label>
                <Input v-model.number="form.new_quantity" 
                       type="number" 
                       min="0"
                       class="w-full" />
                
                <div v-if="difference !== 0" class="mt-2 text-sm" :class="{
                    'text-green-600': isIncreasing,
                    'text-red-600': isDecreasing
                }">
                    {{ isIncreasing ? '+' : '' }}{{ difference }} units 
                    {{ isIncreasing ? 'added to' : 'removed from' }} stock
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Reason for Adjustment</label>
                <Textarea v-model="form.reason" 
                          rows="3"
                          placeholder="e.g., Physical count found 15 units, system showed 10"
                          class="w-full" />
            </div>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-sm text-yellow-800">
                    <strong>Warning:</strong> This adjustment will affect available stock immediately.
                    If stock is being decreased, any pending orders may be affected.
                </p>
            </div>
            
            <div class="flex gap-3 justify-end">
                <Link :href="route('my-shops.inventory.index', shop.slug)">
                    <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" :disabled="form.processing">
                    {{ form.processing ? 'Updating...' : 'Update Stock' }}
                </Button>
            </div>
        </form>
    </div>
</template>
```

### ROUTES (web.php)

[↑ Back to top](#inventory-management---complete-implementation)

```php
use App\Http\Middleware\VerifyCartStock;

Route::middleware(['auth'])->group(function () {
    // Cart routes
    Route::get('/cart', [App\Http\Controllers\Guest\CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add/{product}', [App\Http\Controllers\Guest\CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/update/{cartItem}', [App\Http\Controllers\Guest\CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/remove/{cartItem}', [App\Http\Controllers\Guest\CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart/clear', [App\Http\Controllers\Guest\CartController::class, 'clear'])->name('cart.clear');
    
    // Checkout routes with stock verification
    Route::middleware([VerifyCartStock::class])->group(function () {
        Route::get('/checkout', [App\Http\Controllers\Guest\CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/checkout', [App\Http\Controllers\Guest\CheckoutController::class, 'process'])->name('checkout.process');
    });
});
```

### Testing Checklist

[↑ Back to top](#inventory-management---complete-implementation)

```php
// Unit Tests (Create in tests/Feature/Inventory)
<?php
// tests/Feature/Inventory/StockServiceTest.php

// Copy this checklist and run each test manually or automate

class StockServiceTest extends TestCase
{
    /** @test */
    public function it_can_reserve_stock_for_authenticated_user()
    {
        // 1. Create a product with 10 units
        // 2. Reserve 3 units for user
        // 3. Assert available stock = 7
        // 4. Assert allocated stock = 3
    }
    
    /** @test */
    public function it_cannot_reserve_more_than_available()
    {
        // 1. Create product with 5 units
        // 2. Try to reserve 10 units
        // 3. Assert exception thrown
    }
    
    /** @test */
    public function it_automatically_releases_reservations_after_7_minutes()
    {
        // 1. Create reservation with expires_at = now() - 1 minute
        // 2. Run release command
        // 3. Assert stock returned to available
        // 4. Assert reservation status = 'expired'
    }
    
    /** @test */
    public function it_converts_reservation_to_sale_on_checkout()
    {
        // 1. Create reservation for 3 units
        // 2. Convert to sale with order_id
        // 3. Assert on_hand decreased by 3
        // 4. Assert allocated decreased by 3
        // 5. Assert stock_movement created
    }
    
    /** @test */
    public function it_prevents_checkout_with_expired_reservations()
    {
        // 1. Create expired reservation
        // 2. Try to convert to sale
        // 3. Assert exception thrown
    }
    
    /** @test */
    public function it_updates_stock_status_correctly()
    {
        // 1. Set safety_stock = 5
        // 2. Set available = 10 -> status should be 'in_stock'
        // 3. Set available = 3 -> status should be 'low_stock'
        // 4. Set available = 0 -> status should be 'out_of_stock'
    }
    
    /** @test */
    public function it_records_audit_trail_for_all_movements()
    {
        // 1. Perform initial stock, sale, restock, adjustment
        // 2. Assert stock_movements table has 4 records
        // 3. Assert all have correct before/after snapshots
    }
    
    /** @test */
    public function it_handles_concurrent_reservations_correctly()
    {
        // 1. Create product with 1 unit
        // 2. Attempt 2 simultaneous reservations
        // 3. Assert only 1 succeeds
        // 4. Assert second gets exception
    }
}
```

Manual Testing Scenarios

| # | Scenario | Expected Result | Status |
| --- | --- | --- | --- |
| 1 | User adds product to cart | Stock reserved for 7 minutes, available stock decreases | ☐ |
| 2 | User adds more than available | Error message, not added to cart | ☐ |
| 3 | User waits 8 minutes, then checks out | Error: "Reservation expired" | ☐ |
| 4 | Two users add last item at same time | One gets reservation, other sees out of stock | ☐ |
| 5 | Admin manually adjusts stock | Stock updates, movement recorded | ☐ |
| 6 | User updates cart quantity (increase) | Additional stock reserved if available | ☐ |
| 7 | User updates cart quantity (decrease) | Extra stock released back to available | ☐ |
| 8 | User removes item from cart | Stock reservation released immediately | ☐ |
| 9 | User clears entire cart | All reservations released | ☐ |
| 10 | Checkout with insufficient stock | Redirect to cart with warning | ☐ |
| 11 | Admin sets product to track_inventory = false | Stock checks always pass (unlimited) | ☐ |
| 12 | Product with min_per_order = 2 | Cannot add 1 unit to cart | ☐ |
| | | | |

### DEPLOYMENT CHECKLIST

[↑ Back to top](#inventory-management---complete-implementation)

1. All migrations run without errors.
1. Models have correct relationships.
1. Initialize existing products: php artisan inventory:initialize-stock.
1. StockService methods all tested.
1. CartService integrates correctly with StockService.
1. Vue components render correctly.
1. Admin can adjust stock via UI.
1. Stock status displays on product pages.
1. 7-minute reservation expiry works. Test: Add product to cart, wait 8 minutes, verify stock returns.
1. Concurrent reservation test passes.
1. Scheduled task configured in cron. Set up cron: php artisan schedule:run >> /dev/null 2>&1.
1. Monitor: Check storage/logs/laravel.log for inventory events.

### SUPPORT & TROUBLESHOOTING

[↑ Back to top](#inventory-management---complete-implementation)

Common Issues:

Issue: "SQLSTATE[23000]: Integrity constraint violation"

- Solution: Ensure product has a shop_id before creating stock ledger

Issue: Reservations not expiring

- Solution: Check if cron is running: php artisan schedule:list
- Verify command runs: php artisan inventory:release-expired-reservations

Issue: Stock shows negative

- Solution: This should never happen. Check if a manual adjustment bypassed validation.
- Fix: Run php artisan inventory:fix-negative-stock

Issue: Performance slow with 10,000 products

- Solution: Add indexes (already included)
- Consider: Paginate stock ledger queries, use caching for frequently viewed products

### END OF FILE INVENTORY MANAGEMENT

[↑ Back to top](#inventory-management---complete-implementation)

## INVENTORY MANAGEMENT - SIMPLIFIED IMPLEMENTATION

> **Complete Implementation Guide** | 10 min read

### Core Concept

Track stock through a simple ledger system. Every stock change creates a movement record. Current stock = sum of all movements. No reservations, no cart holds, no complex scheduling.

**When does stock deduct?** At payment confirmation only. Not when adding to cart.

**What about overselling?** Prevent checkout if requested quantity > available stock.

### TABLE OF CONTENTS INVENTORY MANAGEMENT - SIMPLIFIED IMPLEMENTATION

1. [Migrations](#1-migrations)
2. [Models](#2-models)
3. [Services](#3-services)
4. [Exceptions](#4-exceptions)
5. [Controllers](#5-controllers)
6. [Console Commands](#6-console-commands)
7. [Middleware](#7-middleware)
8. [Vue Components & Pages](#8-vue-components--pages)
9. [Routes](#9-routes)
10. [Testing Checklist](#10-testing-checklist)
11. [Deployment Checklist](#11-deployment-checklist)

---

### 1. Migrations

[↑ Back to top](#inventory-management---simplified-implementation)

```bash
php artisan make:migration add_inventory_columns_to_products_table
php artisan make:migration create_inventory_movements_table
```

```php
// database/migrations/xxxx_xx_xx_000001_add_inventory_columns_to_products_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Current stock quantity - denormalized for quick access
            $table->integer('current_stock')->default(0)->after('price');
            
            // Whether to track inventory for this product
            $table->boolean('track_inventory')->default(true)->after('current_stock');
            
            // Minimum stock threshold for low stock alerts
            $table->integer('low_stock_threshold')->default(5)->after('track_inventory');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['current_stock', 'track_inventory', 'low_stock_threshold']);
        });
    }
};
```

```php
// database/migrations/xxxx_xx_xx_000002_create_inventory_movements_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            
            // Relationships
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            
            // Movement details
            $table->enum('type', [
                'initial',      // Initial stock setup
                'restock',      // Adding stock (purchase from supplier)
                'sale',         // Customer purchase (deduct stock)
                'return',       // Customer return (add stock back)
                'damage',       // Damaged/lost goods (deduct stock)
                'adjustment'    // Manual adjustment (positive or negative)
            ]);
            
            $table->integer('quantity'); // Positive = addition, Negative = subtraction
            $table->integer('quantity_before'); // Stock level before this movement
            $table->integer('quantity_after'); // Stock level after this movement
            
            // Reference to other tables
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            
            // Additional info
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['product_id', 'created_at']);
            $table->index(['shop_id', 'type']);
            $table->index(['reference_type', 'reference_id']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
```

---

### 2. Models

[↑ Back to top](#inventory-management---simplified-implementation)

```php
// app/Models/Product.php - Add these methods to existing Product model
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    // ... existing code ...
    
    /**
     * Get all inventory movements for this product.
     */
    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }
    
    /**
     * Check if product has sufficient stock for a given quantity.
     */
    public function hasSufficientStock(int $quantity): bool
    {
        if (!$this->track_inventory) {
            return true;
        }
        
        return $this->current_stock >= $quantity;
    }
    
    /**
     * Get stock status as human-readable string.
     */
    public function getStockStatusAttribute(): string
    {
        if (!$this->track_inventory) {
            return 'Unlimited';
        }
        
        if ($this->current_stock <= 0) {
            return 'Out of Stock';
        }
        
        if ($this->current_stock <= $this->low_stock_threshold) {
            return "Low Stock ({$this->current_stock} left)";
        }
        
        return "In Stock ({$this->current_stock} available)";
    }
    
    /**
     * Get CSS class for stock status badge.
     */
    public function getStockBadgeClassAttribute(): string
    {
        if (!$this->track_inventory) {
            return 'bg-gray-100 text-gray-800';
        }
        
        if ($this->current_stock <= 0) {
            return 'bg-red-100 text-red-800';
        }
        
        if ($this->current_stock <= $this->low_stock_threshold) {
            return 'bg-orange-100 text-orange-800';
        }
        
        return 'bg-green-100 text-green-800';
    }
    
    /**
     * Update stock and record movement.
     */
    public function updateStock(int $newQuantity, string $type, ?int $userId = null, ?string $notes = null, ?array $metadata = null): InventoryMovement
    {
        $oldQuantity = $this->current_stock;
        $quantityChange = $newQuantity - $oldQuantity;
        
        // Create movement record
        $movement = InventoryMovement::create([
            'product_id' => $this->id,
            'shop_id' => $this->shop_id,
            'user_id' => $userId,
            'type' => $type,
            'quantity' => $quantityChange,
            'quantity_before' => $oldQuantity,
            'quantity_after' => $newQuantity,
            'notes' => $notes,
            'metadata' => $metadata
        ]);
        
        // Update product stock
        $this->current_stock = $newQuantity;
        $this->save();
        
        return $movement;
    }
    
    /**
     * Add stock (positive movement).
     */
    public function addStock(int $quantity, string $type, ?int $userId = null, ?string $notes = null): InventoryMovement
    {
        $newQuantity = $this->current_stock + $quantity;
        return $this->updateStock($newQuantity, $type, $userId, $notes);
    }
    
    /**
     * Remove stock (negative movement).
     */
    public function removeStock(int $quantity, string $type, ?int $userId = null, ?string $notes = null): InventoryMovement
    {
        if (!$this->hasSufficientStock($quantity)) {
            throw new \App\Exceptions\InsufficientStockException(
                "Cannot remove {$quantity} units. Only {$this->current_stock} available."
            );
        }
        
        $newQuantity = $this->current_stock - $quantity;
        return $this->updateStock($newQuantity, $type, $userId, $notes);
    }
}
```

```php
// app/Models/InventoryMovement.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    protected $table = 'inventory_movements';
    
    protected $fillable = [
        'product_id',
        'shop_id',
        'user_id',
        'type',
        'quantity',
        'quantity_before',
        'quantity_after',
        'reference_type',
        'reference_id',
        'notes',
        'metadata'
    ];
    
    protected $casts = [
        'quantity' => 'integer',
        'quantity_before' => 'integer',
        'quantity_after' => 'integer',
        'reference_id' => 'integer',
        'metadata' => 'array',
        'created_at' => 'datetime'
    ];
    
    /**
     * Get the product this movement belongs to.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    /**
     * Get the shop this movement belongs to.
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }
    
    /**
     * Get the user who performed this movement.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the polymorphic reference (order, etc.).
     */
    public function reference()
    {
        return $this->morphTo();
    }
    
    /**
     * Scope: Get only movements for a specific shop.
     */
    public function scopeForShop($query, int $shopId)
    {
        return $query->where('shop_id', $shopId);
    }
    
    /**
     * Scope: Get only sale movements.
     */
    public function scopeSales($query)
    {
        return $query->where('type', 'sale');
    }
    
    /**
     * Get human-readable type label.
     */
    public function getTypeLabelAttribute(): string
    {
        return [
            'initial' => 'Initial Stock',
            'restock' => 'Restock',
            'sale' => 'Sale',
            'return' => 'Customer Return',
            'damage' => 'Damaged Goods',
            'adjustment' => 'Manual Adjustment'
        ][$this->type] ?? $this->type;
    }
    
    /**
     * Get formatted quantity with sign.
     */
    public function getFormattedQuantityAttribute(): string
    {
        $sign = $this->quantity > 0 ? '+' : '';
        return $sign . number_format($this->quantity);
    }
}
```

---

### 3. Services

[↑ Back to top](#inventory-management---simplified-implementation)

```php
// app/Services/Inventory/InventoryService.php
<?php

namespace App\Services\Inventory;

use App\Models\Product;
use App\Models\Shop;
use App\Models\InventoryMovement;
use App\Exceptions\InsufficientStockException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InventoryService
{
    /**
     * Get current stock for a product.
     */
    public function getCurrentStock(Product $product): int
    {
        if (!$product->track_inventory) {
            return PHP_INT_MAX; // Effectively unlimited
        }
        
        return $product->current_stock;
    }
    
    /**
     * Check if product has sufficient stock.
     */
    public function hasSufficientStock(Product $product, int $quantity): bool
    {
        if (!$product->track_inventory) {
            return true;
        }
        
        return $product->current_stock >= $quantity;
    }
    
    /**
     * Add stock to a product.
     */
    public function addStock(
        Product $product,
        int $quantity,
        string $type,
        ?int $userId = null,
        ?string $notes = null,
        ?array $metadata = null
    ): InventoryMovement {
        return DB::transaction(function () use ($product, $quantity, $type, $userId, $notes, $metadata) {
            $movement = $product->addStock($quantity, $type, $userId, $notes);
            
            if ($metadata) {
                $movement->metadata = $metadata;
                $movement->save();
            }
            
            Log::info("Stock added to product", [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $quantity,
                'type' => $type,
                'new_stock' => $product->current_stock
            ]);
            
            return $movement;
        });
    }
    
    /**
     * Remove stock from a product.
     */
    public function removeStock(
        Product $product,
        int $quantity,
        string $type,
        ?int $userId = null,
        ?string $notes = null,
        ?array $metadata = null
    ): InventoryMovement {
        if (!$this->hasSufficientStock($product, $quantity)) {
            throw new InsufficientStockException(
                "Only {$product->current_stock} units available for '{$product->name}'"
            );
        }
        
        return DB::transaction(function () use ($product, $quantity, $type, $userId, $notes, $metadata) {
            $movement = $product->removeStock($quantity, $type, $userId, $notes);
            
            if ($metadata) {
                $movement->metadata = $metadata;
                $movement->save();
            }
            
            Log::info("Stock removed from product", [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $quantity,
                'type' => $type,
                'new_stock' => $product->current_stock
            ]);
            
            return $movement;
        });
    }
    
    /**
     * Deduct stock for an order (at payment confirmation).
     */
    public function deductForOrder(Product $product, int $quantity, int $orderId, ?int $userId = null): InventoryMovement
    {
        return $this->removeStock(
            product: $product,
            quantity: $quantity,
            type: 'sale',
            userId: $userId,
            notes: "Order #{$orderId} - Payment confirmed",
            metadata: ['order_id' => $orderId]
        );
    }
    
    /**
     * Add stock for a customer return.
     */
    public function addForReturn(Product $product, int $quantity, int $orderId, ?int $userId = null): InventoryMovement
    {
        return $this->addStock(
            product: $product,
            quantity: $quantity,
            type: 'return',
            userId: $userId,
            notes: "Return from order #{$orderId}",
            metadata: ['order_id' => $orderId]
        );
    }
    
    /**
     * Get inventory movement history for a product.
     */
    public function getMovementHistory(Product $product, int $perPage = 20)
    {
        return $product->inventoryMovements()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
    
    /**
     * Get low stock products for a shop.
     */
    public function getLowStockProducts(Shop $shop)
    {
        return Product::where('shop_id', $shop->id)
            ->where('track_inventory', true)
            ->where('current_stock', '<=', DB::raw('low_stock_threshold'))
            ->where('current_stock', '>', 0)
            ->orderBy('current_stock', 'asc')
            ->get();
    }
    
    /**
     * Get out of stock products for a shop.
     */
    public function getOutOfStockProducts(Shop $shop)
    {
        return Product::where('shop_id', $shop->id)
            ->where('track_inventory', true)
            ->where('current_stock', '<=', 0)
            ->orderBy('name', 'asc')
            ->get();
    }
    
    /**
     * Bulk update stock for multiple products.
     */
    public function bulkUpdateStock(array $updates, int $userId): array
    {
        $results = [
            'success' => [],
            'failed' => []
        ];
        
        foreach ($updates as $update) {
            try {
                $product = Product::findOrFail($update['product_id']);
                
                if ($update['type'] === 'add') {
                    $this->addStock(
                        product: $product,
                        quantity: $update['quantity'],
                        type: 'restock',
                        userId: $userId,
                        notes: $update['notes'] ?? null
                    );
                } else {
                    $this->removeStock(
                        product: $product,
                        quantity: $update['quantity'],
                        type: 'adjustment',
                        userId: $userId,
                        notes: $update['notes'] ?? null
                    );
                }
                
                $results['success'][] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'new_stock' => $product->current_stock
                ];
                
            } catch (\Exception $e) {
                $results['failed'][] = [
                    'product_id' => $update['product_id'],
                    'error' => $e->getMessage()
                ];
            }
        }
        
        return $results;
    }
}
```

---

### 4. Exceptions

[↑ Back to top](#inventory-management---simplified-implementation)

```php
// app/Exceptions/InsufficientStockException.php
<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    /**
     * Render the exception as an HTTP response.
     */
    public function render($request)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => $this->getMessage(),
                'error' => 'insufficient_stock',
                'code' => 422
            ], 422);
        }
        
        // For Inertia.js requests
        if ($request->inertia()) {
            return back()->with('error', $this->getMessage());
        }
        
        return redirect()->back()
            ->with('error', $this->getMessage())
            ->withInput();
    }
}
```

---

### 5. Controllers

[↑ Back to top](#inventory-management---simplified-implementation)

```php
// app/Http/Controllers/Shops/MyShopInventoryController.php
<?php

namespace App\Http\Controllers\Shops;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\Product;
use App\Services\Inventory\InventoryService;
use App\Exceptions\InsufficientStockException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyShopInventoryController extends Controller
{
    protected $inventoryService;
    
    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }
    
    /**
     * Display inventory management page.
     */
    public function index(Shop $shop, Request $request)
    {
        $query = Product::where('shop_id', $shop->id);
        
        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }
        
        if ($request->filled('stock_status')) {
            switch ($request->stock_status) {
                case 'in_stock':
                    $query->where('current_stock', '>', 0)
                          ->where('track_inventory', true);
                    break;
                case 'low_stock':
                    $query->where('track_inventory', true)
                          ->where('current_stock', '>', 0)
                          ->whereColumn('current_stock', '<=', 'low_stock_threshold');
                    break;
                case 'out_of_stock':
                    $query->where('track_inventory', true)
                          ->where('current_stock', '<=', 0);
                    break;
                case 'unlimited':
                    $query->where('track_inventory', false);
                    break;
            }
        }
        
        $products = $query->orderBy('name')->paginate(20);
        
        // Get summary stats
        $stats = [
            'total_products' => Product::where('shop_id', $shop->id)->count(),
            'low_stock_count' => $this->inventoryService->getLowStockProducts($shop)->count(),
            'out_of_stock_count' => $this->inventoryService->getOutOfStockProducts($shop)->count(),
            'total_value' => Product::where('shop_id', $shop->id)
                ->where('track_inventory', true)
                ->sum(\DB::raw('current_stock * cost_price'))
        ];
        
        return Inertia::render('my-shops/inventory/Index', [
            'shop' => $shop,
            'products' => $products,
            'stats' => $stats,
            'filters' => $request->only(['search', 'stock_status'])
        ]);
    }
    
    /**
     * Show form to add stock to a product.
     */
    public function create(Shop $shop, Product $product)
    {
        return Inertia::render('my-shops/inventory/Create', [
            'shop' => $shop,
            'product' => $product,
            'current_stock' => $product->current_stock,
            'low_stock_threshold' => $product->low_stock_threshold,
            'track_inventory' => $product->track_inventory
        ]);
    }
    
    /**
     * Add stock to a product.
     */
    public function store(Request $request, Shop $shop, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500'
        ]);
        
        try {
            $movement = $this->inventoryService->addStock(
                product: $product,
                quantity: $request->quantity,
                type: 'restock',
                userId: auth()->id(),
                notes: $request->notes
            );
            
            return redirect()->route('my-shops.inventory.index', $shop->slug)
                ->with('success', "Added {$request->quantity} units to {$product->name}");
                
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to add stock: ' . $e->getMessage());
        }
    }
    
    /**
     * Show form to remove stock from a product.
     */
    public function edit(Shop $shop, Product $product)
    {
        return Inertia::render('my-shops/inventory/Edit', [
            'shop' => $shop,
            'product' => $product,
            'current_stock' => $product->current_stock
        ]);
    }
    
    /**
     * Remove stock from a product.
     */
    public function update(Request $request, Shop $shop, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:damage,adjustment',
            'notes' => 'nullable|string|max:500'
        ]);
        
        try {
            $movement = $this->inventoryService->removeStock(
                product: $product,
                quantity: $request->quantity,
                type: $request->type,
                userId: auth()->id(),
                notes: $request->notes
            );
            
            return redirect()->route('my-shops.inventory.index', $shop->slug)
                ->with('success', "Removed {$request->quantity} units from {$product->name}");
                
        } catch (InsufficientStockException $e) {
            return back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to remove stock: ' . $e->getMessage());
        }
    }
    
    /**
     * Show stock movement history for a product.
     */
    public function history(Shop $shop, Product $product)
    {
        $movements = $this->inventoryService->getMovementHistory($product, 50);
        
        return Inertia::render('my-shops/inventory/History', [
            'shop' => $shop,
            'product' => $product,
            'movements' => $movements
        ]);
    }
    
    /**
     * Update low stock threshold for a product.
     */
    public function updateThreshold(Request $request, Shop $shop, Product $product)
    {
        $request->validate([
            'low_stock_threshold' => 'required|integer|min:0|max:100'
        ]);
        
        $product->low_stock_threshold = $request->low_stock_threshold;
        $product->save();
        
        return back()->with('success', 'Low stock threshold updated');
    }
    
    /**
     * Toggle inventory tracking for a product.
     */
    public function toggleTracking(Shop $shop, Product $product)
    {
        $product->track_inventory = !$product->track_inventory;
        $product->save();
        
        $status = $product->track_inventory ? 'enabled' : 'disabled';
        
        return back()->with('success', "Inventory tracking {$status} for {$product->name}");
    }
    
    /**
     * Bulk add stock via CSV upload.
     */
    public function bulkUpload(Request $request, Shop $shop)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:1024'
        ]);
        
        // Process CSV file
        $file = $request->file('file');
        $handle = fopen($file->getPathname(), 'r');
        $header = fgetcsv($handle);
        
        $results = [
            'success' => 0,
            'failed' => 0,
            'errors' => []
        ];
        
        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);
            
            $product = Product::where('shop_id', $shop->id)
                ->where(function ($q) use ($data) {
                    $q->where('sku', $data['sku'])
                      ->orWhere('name', $data['product_name']);
                })
                ->first();
            
            if (!$product) {
                $results['failed']++;
                $results['errors'][] = "Product not found: {$data['product_name']}";
                continue;
            }
            
            try {
                $this->inventoryService->addStock(
                    product: $product,
                    quantity: (int) $data['quantity'],
                    type: 'restock',
                    userId: auth()->id(),
                    notes: 'Bulk upload from CSV'
                );
                $results['success']++;
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][] = "{$product->name}: {$e->getMessage()}";
            }
        }
        
        fclose($handle);
        
        return back()->with('bulk_results', $results);
    }
}
```

```php
// Add to app/Http/Controllers/Guest/CheckoutController.php
// Add this method to your existing CheckoutController

/**
 * Process checkout and create order (with stock deduction).
 */
public function process(Request $request)
{
    // ... existing validation ...
    
    $cart = $this->cartService->getCart(auth()->id());
    
    // Verify stock before processing payment
    foreach ($cart->items as $item) {
        if (!$item->product->hasSufficientStock($item->quantity)) {
            throw new InsufficientStockException(
                "{$item->product->name} is out of stock. Only {$item->product->current_stock} available."
            );
        }
    }
    
    DB::transaction(function () use ($request, $cart) {
        // Create order (your existing code)
        $order = Order::create([...]);
        
        // Create order items
        foreach ($cart->items as $cartItem) {
            OrderItem::create([...]);
            
            // DEDUCT STOCK HERE - At payment confirmation
            $this->inventoryService->deductForOrder(
                product: $cartItem->product,
                quantity: $cartItem->quantity,
                orderId: $order->id,
                userId: auth()->id()
            );
        }
        
        // Clear cart
        $this->cartService->clearCart(auth()->id());
    });
    
    return redirect()->route('orders.show', $order)
        ->with('success', 'Order placed successfully!');
}
```

---

### 6. Console Commands

[↑ Back to top](#inventory-management---simplified-implementation)

```php
// app/Console/Commands/InitializeProductStock.php
<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\Inventory\InventoryService;
use Illuminate\Console\Command;

class InitializeProductStock extends Command
{
    protected $signature = 'inventory:initialize 
                            {--product-id= : Initialize stock for specific product}
                            {--default-stock=0 : Default stock quantity}';
    
    protected $description = 'Initialize stock for existing products that have no movements';
    
    private $inventoryService;
    
    public function __construct(InventoryService $inventoryService)
    {
        parent::__construct();
        $this->inventoryService = $inventoryService;
    }
    
    public function handle()
    {
        $query = Product::query();
        
        if ($this->option('product-id')) {
            $query->where('id', $this->option('product-id'));
        }
        
        $products = $query->whereDoesntHave('inventoryMovements')->get();
        $defaultStock = (int) $this->option('default-stock');
        
        if ($products->isEmpty()) {
            $this->info('No products need initialization.');
            return Command::SUCCESS;
        }
        
        $this->info("Initializing stock for {$products->count()} products...");
        
        $bar = $this->output->createProgressBar($products->count());
        
        foreach ($products as $product) {
            if ($defaultStock > 0) {
                $this->inventoryService->addStock(
                    product: $product,
                    quantity: $defaultStock,
                    type: 'initial',
                    userId: 1,
                    notes: 'System initialization'
                );
                $this->line(" ✓ {$product->name}: +{$defaultStock} units");
            } else {
                $this->line(" ⚠ {$product->name}: No stock set (current_stock = 0)");
            }
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine();
        $this->info('Stock initialization complete!');
        
        return Command::SUCCESS;
    }
}
```

```php
// app/Console/Commands/SendLowStockAlert.php
<?php

namespace App\Console\Commands;

use App\Models\Shop;
use App\Services\Inventory\InventoryService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendLowStockAlert extends Command
{
    protected $signature = 'inventory:low-stock-alert';
    protected $description = 'Send email alerts to shop owners for low stock products';
    
    private $inventoryService;
    
    public function __construct(InventoryService $inventoryService)
    {
        parent::__construct();
        $this->inventoryService = $inventoryService;
    }
    
    public function handle()
    {
        $shops = Shop::whereHas('products', function ($query) {
            $query->where('track_inventory', true)
                  ->whereColumn('current_stock', '<=', 'low_stock_threshold');
        })->get();
        
        if ($shops->isEmpty()) {
            $this->info('No low stock products found.');
            return Command::SUCCESS;
        }
        
        foreach ($shops as $shop) {
            $lowStockProducts = $this->inventoryService->getLowStockProducts($shop);
            $outOfStockProducts = $this->inventoryService->getOutOfStockProducts($shop);
            
            if ($lowStockProducts->isEmpty() && $outOfStockProducts->isEmpty()) {
                continue;
            }
            
            // Log the alert (you can replace with email later)
            Log::warning('Low stock alert for shop', [
                'shop_id' => $shop->id,
                'shop_name' => $shop->name,
                'low_stock_count' => $lowStockProducts->count(),
                'out_of_stock_count' => $outOfStockProducts->count(),
                'products' => $lowStockProducts->pluck('name', 'current_stock')
            ]);
            
            $this->line("Alert sent to {$shop->name}:");
            $this->line("  - Low Stock: {$lowStockProducts->count()} products");
            $this->line("  - Out of Stock: {$outOfStockProducts->count()} products");
        }
        
        return Command::SUCCESS;
    }
}
```

```php
// app/Console/Kernel.php - Add to schedule method
protected function schedule(Schedule $schedule)
{
    // Send low stock alerts daily at 9 AM
    $schedule->command('inventory:low-stock-alert')->dailyAt('09:00');
}
```

---

### 7. Middleware

[↑ Back to top](#inventory-management---simplified-implementation)

```php
// app/Http/Middleware/VerifyCheckoutStock.php
<?php

namespace App\Http\Middleware;

use App\Services\Cart\CartService;
use App\Services\Inventory\InventoryService;
use App\Exceptions\InsufficientStockException;
use Closure;
use Illuminate\Http\Request;

class VerifyCheckoutStock
{
    protected $cartService;
    protected $inventoryService;
    
    public function __construct(CartService $cartService, InventoryService $inventoryService)
    {
        $this->cartService = $cartService;
        $this->inventoryService = $inventoryService;
    }
    
    /**
     * Verify all cart items have sufficient stock before checkout.
     */
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return $next($request);
        }
        
        $cart = $this->cartService->getCart(auth()->id());
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty');
        }
        
        $insufficientItems = [];
        
        foreach ($cart->items as $item) {
            if (!$item->product->hasSufficientStock($item->quantity)) {
                $insufficientItems[] = [
                    'name' => $item->product->name,
                    'requested' => $item->quantity,
                    'available' => $item->product->current_stock
                ];
            }
        }
        
        if (!empty($insufficientItems)) {
            return redirect()->route('cart.index')
                ->with('error', 'Some items are no longer available in the requested quantity.')
                ->with('insufficient_items', $insufficientItems);
        }
        
        return $next($request);
    }
}
```

```php
// app/Http/Kernel.php - Register middleware
protected $routeMiddleware = [
    // ... other middleware
    'verify.stock' => \App\Http\Middleware\VerifyCheckoutStock::class,
];
```

---

### 8. Vue Components & Pages

[↑ Back to top](#inventory-management---simplified-implementation)

```vue
<!-- resources/js/pages/my-shops/inventory/Index.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Head, Link, router } from '@inertiajs/vue3';
import { Package, AlertTriangle, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-vue-next';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/custom/Pagination.vue';

interface Product {
    id: number;
    name: string;
    sku: string | null;
    price: number;
    cost_price: number | null;
    current_stock: number;
    low_stock_threshold: number;
    track_inventory: boolean;
    stock_status: string;
    stock_badge_class: string;
}

const props = defineProps<{
    shop: { id: number; name: string; slug: string };
    products: { data: Product[]; meta: any };
    stats: {
        total_products: number;
        low_stock_count: number;
        out_of_stock_count: number;
        total_value: number;
    };
    filters: { search?: string; stock_status?: string };
}>();

const search = ref(props.filters.search || '');
const stockStatusFilter = ref(props.filters.stock_status || '');

const debouncedSearch = useDebounceFn(() => {
    router.get(route('my-shops.inventory.index', props.shop.slug), {
        search: search.value,
        stock_status: stockStatusFilter.value
    }, {
        preserveState: true,
        replace: true
    });
}, 300);

watch([search, stockStatusFilter], () => {
    debouncedSearch();
});

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
    }).format(amount);
};

const getStockIcon = (product: Product) => {
    if (!product.track_inventory) return TrendingUp;
    if (product.current_stock <= 0) return XCircle;
    if (product.current_stock <= product.low_stock_threshold) return AlertTriangle;
    return CheckCircle;
};
</script>

<template>
    <Head title="Inventory Management" />

    <div class="app-container">
        <!-- Header -->
        <div class="header">
            <div class="info">
                <h1 class="title">Inventory Management</h1>
                <p class="description">{{ shop.name }} - Manage stock levels for all products</p>
            </div>

            <Link :href="route('my-shops.inventory.bulk', shop.slug)">
                <Button variant="outline">Bulk Upload CSV</Button>
            </Link>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon bg-blue-100">
                    <Package class="w-5 h-5 text-blue-600" />
                </div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.total_products }}</div>
                    <div class="stat-label">Total Products</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon bg-orange-100">
                    <AlertTriangle class="w-5 h-5 text-orange-600" />
                </div>
                <div class="stat-info">
                    <div class="stat-value text-orange-600">{{ stats.low_stock_count }}</div>
                    <div class="stat-label">Low Stock Items</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon bg-red-100">
                    <XCircle class="w-5 h-5 text-red-600" />
                </div>
                <div class="stat-info">
                    <div class="stat-value text-red-600">{{ stats.out_of_stock_count }}</div>
                    <div class="stat-label">Out of Stock</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon bg-green-100">
                    <DollarSign class="w-5 h-5 text-green-600" />
                </div>
                <div class="stat-info">
                    <div class="stat-value">{{ formatCurrency(stats.total_value) }}</div>
                    <div class="stat-label">Inventory Value</div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="filters-bar">
            <Input
                v-model="search"
                type="text"
                placeholder="Search by name or SKU..."
                class="search-input"
            />
            
            <select v-model="stockStatusFilter" class="status-filter">
                <option value="">All Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="unlimited">Unlimited (No Tracking)</option>
            </select>
        </div>

        <!-- Products Table -->
        <div class="table-wrapper">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Threshold</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead class="actions">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow v-for="product in products.data" :key="product.id">
                        <TableCell class="font-medium">{{ product.name }}</TableCell>
                        <TableCell class="text-sm text-gray-500">{{ product.sku || 'N/A' }}</TableCell>
                        <TableCell>
                            <div :class="product.stock_badge_class" 
                                 class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
                                <component :is="getStockIcon(product)" class="w-3 h-3" />
                                {{ product.stock_status }}
                            </div>
                        </TableCell>
                        <TableCell>
                            <span :class="{ 'font-bold text-red-600': product.current_stock === 0 }">
                                {{ product.track_inventory ? product.current_stock : '∞' }}
                            </span>
                        </TableCell>
                        <TableCell>{{ product.low_stock_threshold }}</TableCell>
                        <TableCell>{{ formatCurrency(product.price) }}</TableCell>
                        <TableCell class="actions">
                            <div class="action-buttons">
                                <Link :href="route('my-shops.inventory.create', {shop: shop.slug, product: product.id})"
                                      class="btn-sm btn-primary">
                                    + Add Stock
                                </Link>
                                <Link :href="route('my-shops.inventory.edit', {shop: shop.slug, product: product.id})"
                                      class="btn-sm btn-danger">
                                    - Remove
                                </Link>
                                <Link :href="route('my-shops.inventory.history', {shop: shop.slug, product: product.id})"
                                      class="btn-sm btn-outline">
                                    History
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                    
                    <TableRow v-if="products.data.length === 0">
                        <TableCell colspan="7" class="text-center py-8 text-gray-500">
                            No products found
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <Pagination :meta="products.meta" />
    </div>
</template>

<style scoped>
.app-container {
    @apply max-w-7xl mx-auto px-4 py-8;
}

.header {
    @apply flex justify-between items-center mb-6;
}

.title {
    @apply text-2xl font-bold text-gray-900;
}

.description {
    @apply text-sm text-gray-500 mt-1;
}

.stats-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6;
}

.stat-card {
    @apply flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border;
}

.stat-icon {
    @apply p-3 rounded-full;
}

.stat-value {
    @apply text-2xl font-bold;
}

.stat-label {
    @apply text-sm text-gray-500;
}

.filters-bar {
    @apply flex gap-3 mb-6;
}

.search-input {
    @apply flex-1;
}

.status-filter {
    @apply px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900;
}

.table-wrapper {
    @apply bg-white rounded-lg shadow-sm overflow-hidden;
}

.actions {
    @apply text-right;
}

.action-buttons {
    @apply flex gap-2 justify-end;
}

.btn-sm {
    @apply px-3 py-1 text-sm rounded-md transition;
}

.btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700;
}

.btn-outline {
    @apply border border-gray-300 text-gray-700 hover:bg-gray-50;
}
</style>
```

```vue
<!-- resources/js/pages/my-shops/inventory/Create.vue (Add Stock) -->
<script setup lang="ts">
import { ref } from 'vue';
import { Head, useForm, router, Link } from '@inertiajs/vue3';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';

const props = defineProps<{
    shop: { id: number; name: string; slug: string };
    product: { id: number; name: string; sku: string; current_stock: number };
}>();

const form = useForm({
    quantity: 1,
    notes: ''
});

const submit = () => {
    form.post(route('my-shops.inventory.store', {
        shop: props.shop.slug,
        product: props.product.id
    }), {
        preserveScroll: true,
        onSuccess: () => {
            router.visit(route('my-shops.inventory.index', props.shop.slug));
        }
    });
};
</script>

<template>
    <Head :title="`Add Stock - ${product.name}`" />

    <div class="max-w-2xl mx-auto py-8 px-4">
        <div class="mb-6">
            <Link :href="route('my-shops.inventory.index', shop.slug)" 
                  class="text-blue-600 hover:underline text-sm">
                ← Back to Inventory
            </Link>
            <h1 class="text-2xl font-bold mt-2">Add Stock: {{ product.name }}</h1>
            <p class="text-gray-500">SKU: {{ product.sku || 'N/A' }} | Current Stock: {{ product.current_stock }}</p>
        </div>

        <form @submit.prevent="submit" class="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
                <label class="block text-sm font-medium mb-1">Quantity to Add *</label>
                <Input v-model.number="form.quantity" 
                       type="number" 
                       min="1"
                       required />
                <p class="text-xs text-gray-500 mt-1">New stock will be {{ product.current_stock + form.quantity }} units</p>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Notes (Optional)</label>
                <Textarea v-model="form.notes" 
                          rows="3"
                          placeholder="e.g., Restock from supplier XYZ, PO #12345" />
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-sm text-blue-800">
                    Adding stock will create an inventory movement record and increase your available stock for sale.
                </p>
            </div>

            <div class="flex gap-3 justify-end">
                <Link :href="route('my-shops.inventory.index', shop.slug)">
                    <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" :disabled="form.processing">
                    {{ form.processing ? 'Adding...' : 'Add Stock' }}
                </Button>
            </div>
        </form>
    </div>
</template>
```

```vue
<!-- resources/js/pages/my-shops/inventory/Edit.vue (Remove Stock) -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, useForm, router, Link } from '@inertiajs/vue3';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';

const props = defineProps<{
    shop: { id: number; name: string; slug: string };
    product: { id: number; name: string; sku: string; current_stock: number };
}>();

const form = useForm({
    quantity: 1,
    type: 'adjustment',
    notes: ''
});

const maxQuantity = computed(() => props.product.current_stock);

const submit = () => {
    form.put(route('my-shops.inventory.update', {
        shop: props.shop.slug,
        product: props.product.id
    }), {
        preserveScroll: true,
        onSuccess: () => {
            router.visit(route('my-shops.inventory.index', props.shop.slug));
        }
    });
};
</script>

<template>
    <Head :title="`Remove Stock - ${product.name}`" />

    <div class="max-w-2xl mx-auto py-8 px-4">
        <div class="mb-6">
            <Link :href="route('my-shops.inventory.index', shop.slug)" 
                  class="text-blue-600 hover:underline text-sm">
                ← Back to Inventory
            </Link>
            <h1 class="text-2xl font-bold mt-2">Remove Stock: {{ product.name }}</h1>
            <p class="text-gray-500">SKU: {{ product.sku || 'N/A' }} | Current Stock: {{ product.current_stock }}</p>
        </div>

        <form @submit.prevent="submit" class="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
                <label class="block text-sm font-medium mb-1">Remove Type *</label>
                <select v-model="form.type" class="w-full border rounded-lg px-3 py-2">
                    <option value="damage">Damaged Goods</option>
                    <option value="adjustment">Manual Adjustment (e.g., lost, stolen, expired)</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Quantity to Remove *</label>
                <Input v-model.number="form.quantity" 
                       type="number" 
                       :min="1"
                       :max="maxQuantity"
                       required />
                <p class="text-xs text-gray-500 mt-1">Max available: {{ maxQuantity }} units</p>
                <p v-if="form.quantity > maxQuantity" class="text-xs text-red-500 mt-1">
                    Cannot remove more than available stock
                </p>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Reason (Optional)</label>
                <Textarea v-model="form.notes" 
                          rows="3"
                          placeholder="e.g., 5 units damaged during transit" />
            </div>

            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-sm text-red-800">
                    Warning: Removing stock will permanently reduce your available inventory.
                    New stock level will be {{ product.current_stock - form.quantity }} units.
                </p>
            </div>

            <div class="flex gap-3 justify-end">
                <Link :href="route('my-shops.inventory.index', shop.slug)">
                    <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" :disabled="form.processing || form.quantity > maxQuantity">
                    {{ form.processing ? 'Removing...' : 'Remove Stock' }}
                </Button>
            </div>
        </form>
    </div>
</template>
```

```vue
<!-- resources/js/pages/my-shops/inventory/History.vue -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/custom/Pagination.vue';

interface Movement {
    id: number;
    type: string;
    type_label: string;
    quantity: number;
    formatted_quantity: string;
    quantity_before: number;
    quantity_after: number;
    notes: string | null;
    created_at: string;
    user: { name: string } | null;
}

const props = defineProps<{
    shop: { id: number; name: string; slug: string };
    product: { id: number; name: string };
    movements: { data: Movement[]; meta: any };
}>();

const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
};

const getTypeColor = (type: string) => {
    const colors = {
        initial: 'bg-gray-100 text-gray-800',
        restock: 'bg-green-100 text-green-800',
        sale: 'bg-blue-100 text-blue-800',
        return: 'bg-purple-100 text-purple-800',
        damage: 'bg-red-100 text-red-800',
        adjustment: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};
</script>

<template>
    <Head :title="`Stock History - ${product.name}`" />

    <div class="max-w-5xl mx-auto py-8 px-4">
        <div class="mb-6">
            <Link :href="route('my-shops.inventory.index', shop.slug)" 
                  class="text-blue-600 hover:underline text-sm">
                ← Back to Inventory
            </Link>
            <h1 class="text-2xl font-bold mt-2">Stock History: {{ product.name }}</h1>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Before</TableHead>
                        <TableHead>After</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Notes</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow v-for="movement in movements.data" :key="movement.id">
                        <TableCell class="whitespace-nowrap text-sm">
                            {{ formatDate(movement.created_at) }}
                        </TableCell>
                        <TableCell>
                            <span :class="getTypeColor(movement.type)" 
                                  class="inline-block px-2 py-1 rounded-full text-xs font-medium">
                                {{ movement.type_label }}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span :class="movement.quantity > 0 ? 'text-green-600' : 'text-red-600'"
                                  class="font-medium">
                                {{ movement.formatted_quantity }}
                            </span>
                        </TableCell>
                        <TableCell>{{ movement.quantity_before }}</TableCell>
                        <TableCell class="font-medium">{{ movement.quantity_after }}</TableCell>
                        <TableCell class="text-sm">{{ movement.user?.name || 'System' }}</TableCell>
                        <TableCell class="text-sm text-gray-500">{{ movement.notes || '-' }}</TableCell>
                    </TableRow>

                    <TableRow v-if="movements.data.length === 0">
                        <TableCell colspan="7" class="text-center py-8 text-gray-500">
                            No stock movements found
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <div class="mt-4">
            <Pagination :meta="movements.meta" />
        </div>
    </div>
</template>
```

```vue
<!-- Add stock status to product page (guest/products/Show.vue) -->
<!-- Add this to your existing product show page -->

<div class="stock-status" :class="product.stock_badge_class">
    <CheckCircle v-if="product.current_stock > 0 && product.current_stock > product.low_stock_threshold" class="w-5 h-5" />
    <AlertTriangle v-else-if="product.current_stock > 0 && product.current_stock <= product.low_stock_threshold" class="w-5 h-5" />
    <XCircle v-else class="w-5 h-5" />
    <span>{{ product.stock_status }}</span>
</div>

<!-- Add to cart button with stock validation -->
<button @click="addToCart" 
        :disabled="!product.hasSufficientStock(1) || !product.track_inventory"
        class="add-to-cart-btn">
    Add to Cart
</button>
```

---

### 9. Routes

[↑ Back to top](#inventory-management---simplified-implementation)

```php
// routes/web.php - Add these routes inside the seller middleware group

Route::middleware(['auth', 'verified', 'role:seller'])->group(function () {
    Route::prefix('my-shops')
        ->name('my-shops.')
        ->group(function() {
            
            // ... existing routes ...
            
            // Inventory Management Routes
            Route::prefix('{shop:slug}/inventory')
                ->name('inventory.')
                ->controller(\App\Http\Controllers\Shops\MyShopInventoryController::class)
                ->group(function() {
                    Route::get('/', 'index')->name('index');
                    Route::get('/bulk', 'bulkForm')->name('bulk');
                    Route::post('/bulk', 'bulkUpload')->name('bulk.upload');
                    Route::get('/{product}/create', 'create')->name('create');
                    Route::post('/{product}', 'store')->name('store');
                    Route::get('/{product}/edit', 'edit')->name('edit');
                    Route::put('/{product}', 'update')->name('update');
                    Route::get('/{product}/history', 'history')->name('history');
                    Route::patch('/{product}/threshold', 'updateThreshold')->name('threshold');
                    Route::patch('/{product}/toggle-tracking', 'toggleTracking')->name('toggle-tracking');
                });
        });
});

// Apply stock verification middleware to checkout
Route::middleware(['auth', 'verify.stock'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');
});
```

---

### 10. Testing Checklist

[↑ Back to top](#inventory-management---simplified-implementation)

#### Manual Testing Scenarios

| # | Test Scenario | Expected Result | Status |
| --- | --------------- | ----------------- | -------- |
| 1 | Shop owner adds stock to product | Stock increases, movement recorded | ☐ |
| 2 | Shop owner removes stock (damage) | Stock decreases, movement recorded | ☐ |
| 3 | Shop owner tries to remove more than available | Error message, no stock change | ☐ |
| 4 | Customer purchases product | Stock deducts at payment confirmation | ☐ |
| 5 | Customer tries to buy more than available | Error at checkout, order not created | ☐ |
| 6 | Product with track_inventory = false | Shows "Unlimited", always in stock | ☐ |
| 7 | Low stock threshold reached | Shows "Low Stock" badge, alert logged | ☐ |
| 8 | Out of stock product | "Out of Stock" badge, add to cart disabled | ☐ |
| 9 | View inventory history page | Shows all movements with correct before/after | ☐ |
| 10 | Bulk upload CSV | Multiple products updated successfully | ☐ |
| 11 | Search/filter inventory table | Shows correct filtered results | ☐ |
| 12 | Customer return processed | Stock added back with "return" movement | ☐ |

#### Database Validation Queries

```sql
-- Check current stock vs sum of movements
SELECT 
    p.id,
    p.name,
    p.current_stock,
    SUM(CASE WHEN im.type IN ('sale', 'damage') THEN -im.quantity ELSE im.quantity END) as calculated_stock
FROM products p
LEFT JOIN inventory_movements im ON p.id = im.product_id
GROUP BY p.id, p.name, p.current_stock
HAVING p.current_stock != COALESCE(SUM(CASE WHEN im.type IN ('sale', 'damage') THEN -im.quantity ELSE im.quantity END), 0);

-- Check low stock products
SELECT name, current_stock, low_stock_threshold 
FROM products 
WHERE track_inventory = 1 
AND current_stock <= low_stock_threshold 
ORDER BY current_stock ASC;

-- Check stock movement audit trail
SELECT 
    COUNT(*) as total_movements,
    type,
    COUNT(DISTINCT product_id) as products_affected
FROM inventory_movements
GROUP BY type;
```

---

### 11. Deployment Checklist

[↑ Back to top](#inventory-management---simplified-implementation)

### Pre-Deployment

- [ ] Run migrations: `php artisan migrate`
- [ ] Initialize stock for existing products: `php artisan inventory:initialize --default-stock=10`
- [ ] Verify product counts: `php artisan tinker --execute="App\Models\Product::count()"`
- [ ] Check for products without stock ledger: Run validation query above
- [ ] Test stock addition/removal in staging environment
- [ ] Test checkout flow with stock deduction

#### Deployment Steps

1. **Run Migrations**

   ```bash
   php artisan migrate
   ```

1. **Initialize Stock**

   (Set default stock only if you want initial inventory)

   ```bash
   php artisan inventory:initialize --default-stock=0
   ```

1. **Set Up Scheduled Jobs**

   ```bash
   # Add to crontab
   * * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
   ```

1. **Clear Cache**

   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

1. **Restart Queue Workers** (if using queues)

   ```bash
   php artisan queue:restart
   ```

#### Post-Deployment Verification

- [ ] Verify product stock shows correctly on frontend
- [ ] Test adding stock as shop owner
- [ ] Test checkout with stock deduction
- [ ] Verify low stock alerts are working
- [ ] Check inventory history page loads
- [ ] Monitor logs for any stock-related errors

#### Monitoring Commands

```bash
# Check low stock products daily
php artisan inventory:low-stock-alert

# Fix negative stock (if ever occurs - should not happen with validation)
php artisan tinker --execute="
    App\Models\Product::where('current_stock', '<', 0)->each(function($p) {
        $p->update(['current_stock' => 0]);
        $p->addStock(abs($p->current_stock), 'adjustment', 1, 'Fixed negative stock');
    });
"
```

---

### END OF FILE INVENTORY MANAGEMENT - SIMPLIFIED IMPLEMENTATION

[↑ Back to top](#inventory-management---simplified-implementation)

## Discounts: How Major E-commerce Platforms Handle Discounts

Amazon & Alibaba's Approach

Large marketplaces use a multi-layered discount engine with clear precedence rules:

- Stacking with Priority - Discounts are evaluated in a specific order, and rules determine whether they can combine (stack) or if one overrides another
- Centralized Rule Management - All active promotions live in one system with version control, budgets, and expiration dates
- Real-time Validation - Every discount is validated against eligibility criteria before application

Shopify's Architecture:

Shopify handles complexity through:

- Customer segmentation for targeted discounts
- Tiered pricing structures for volume discounts
- Contract pricing for B2B scenarios
- API-first approach allowing custom discount logic

Key Insight from Real Implementations

A major lesson: "Odoo's interpretation applies discounts to each individual product in that category, not cumulatively across the category". This is why your category vs. product conflict exists—you need to explicitly define how discounts interact.
The Best Solution: A Unified Discount Rules Table

Instead of storing discounts on products or categories directly, create a dedicated discount rules engine. Here's the database schema:

```sql
-- Main discount rules table
CREATE TABLE discount_rules (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    rule_type ENUM('cart', 'product', 'category', 'customer_group'),
    discount_type ENUM('percentage', 'fixed_amount', 'buy_x_get_y'),
    discount_value DECIMAL(10,2),
    
    -- Conditions (JSON for flexibility)
    conditions JSON, -- e.g., {"min_quantity": 2, "min_amount": 100}
    
    -- Targeting
    target_ids JSON, -- product_ids, category_ids, or null for cart-wide
    
    -- Priority & Stacking
    priority INT DEFAULT 0, -- Lower number = higher priority
    stackable BOOLEAN DEFAULT false,
    
    -- Limits
    usage_limit INT,
    usage_per_customer INT,
    valid_from DATETIME,
    valid_until DATETIME,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP
);

-- Track redemptions
CREATE TABLE discount_redemptions (
    id BIGINT PRIMARY KEY,
    discount_rule_id BIGINT,
    order_id BIGINT,
    customer_id BIGINT,
    discount_amount DECIMAL(10,2),
    redeemed_at TIMESTAMP
);
```

Priority Resolution Logic

Here's how to resolve conflicts deterministically

```php
<?php

namespace App\Services;

use App\Models\DiscountRule;

class DiscountEngine
{
    /**
     * Get applicable discounts for a cart
     * Order: Product > Category > Cart > Customer Group
     * Within same type: higher priority (lower number) wins
     */
    public function getApplicableDiscounts($cart, $items)
    {
        $applicableRules = [];
        
        // 1. Product-specific rules (highest priority)
        foreach ($items as $item) {
            $rules = DiscountRule::where('rule_type', 'product')
                ->whereJsonContains('target_ids', $item->product_id)
                ->where('is_active', true)
                ->get();
            $applicableRules = array_merge($applicableRules, $rules->toArray());
        }
        
        // 2. Category rules
        foreach ($items as $item) {
            $categoryIds = $item->product->categories->pluck('id');
            $rules = DiscountRule::where('rule_type', 'category')
                ->where(function($q) use ($categoryIds) {
                    foreach ($categoryIds as $catId) {
                        $q->orWhereJsonContains('target_ids', $catId);
                    }
                })
                ->get();
            $applicableRules = array_merge($applicableRules, $rules->toArray());
        }
        
        // 3. Cart-wide rules
        $cartRules = DiscountRule::where('rule_type', 'cart')
            ->where('is_active', true)
            ->get();
        $applicableRules = array_merge($applicableRules, $cartRules->toArray());
        
        // 4. Sort by priority, validate conditions, handle stacking
        return $this->resolveConflicts($applicableRules);
    }
    
    private function resolveConflicts($rules)
    {
        // Sort by priority (lower number = higher priority)
        usort($rules, function($a, $b) {
            return $a['priority'] <=> $b['priority'];
        });
        
        $finalDiscounts = [];
        $currentDiscount = null;
        
        foreach ($rules as $rule) {
            if (!$rule['stackable'] && $currentDiscount !== null) {
                // Non-stackable rule found, stop processing
                break;
            }
            
            if ($this->validateConditions($rule)) {
                $finalDiscounts[] = $rule;
                $currentDiscount = $rule;
                
                // If this rule says "ignore other rules" (like Priority 1 in EKM example[citation:2])
                if ($rule['priority'] === 1 && !$rule['stackable']) {
                    return [$rule]; // Only this discount applies
                }
            }
        }
        
        return $finalDiscounts;
    }
}
```

Discount Types & Their Use Cases

Based on research of major platforms:

| Discount Type | Best For | Example | Stacking Behavior |
| ----- | ----- | ----- | ----- |
| Product-specific | Clearance, individual items | "20% off iPhone cases" | Usually exclusive |
| Category-wide | Department sales | "15% off Electronics" | Can stack with product |
| Cart-level | Sitewide promotions | "10% off $50+" | Often stackable |
| Volume/Tiered | Wholesale, bulk purchases | "Buy 3-5: 10%, 6+: 20%" | Usually exclusive |
| Customer segment | Loyalty, first-time buyers | "VIP members get 25%" | Stackable with others |
| Buy X Get Y | Inventory clearing | "Buy 2, Get 1 Free" | Usually exclusive |
| | | | |

Implementation Priority: What to Build First

For your MVP, start with this minimal viable system:
Phase 1: Basic Structure

```php
// App/Models/DiscountRule.php
class DiscountRule extends Model
{
    protected $casts = [
        'conditions' => 'array',
        'target_ids' => 'array',
        'stackable' => 'boolean'
    ];
    
    // Scope for active rules
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('valid_from', '<=', now())
            ->where(function($q) {
                $q->whereNull('valid_until')
                ->orWhere('valid_until', '>=', now());
            });
    }
}
```

Phase 2: Cart Integration

Add discount calculation to your cart service:

```php
public function calculateDiscounts($cart)
{
    $engine = new DiscountEngine();
    $applicableDiscounts = $engine->getApplicableDiscounts($cart);
    
    $totalDiscount = 0;
    foreach ($applicableDiscounts as $discount) {
        $totalDiscount += $this->calculateDiscountAmount($discount, $cart);
    }
    
    return $totalDiscount;
}
```

Phase 3: Admin UI

Create a simple interface for:

- Creating discount rules
- Setting priority orders
- Configuring stacking rules
- Viewing redemption analytics

Key Principles from Research:

- Determinism is critical - Same cart should always get same discount
- Validation before redemption - Check all rules before applying any
- Audit trails matter - Track every discount application
- Stacking policy must be explicit - Define early whether discounts combine
- Test in simulation - Never test complex discount rules in production

Bottom Line:

Don't put discounts directly on products or categories. Build a rule engine with:

- A single discount_rules table
- Priority-based resolution
- Explicit stacking policies
- Real-time validation

This scales from simple sitewide sales to complex B2B tiered pricing without breaking your data model. The initial investment is about building the rule engine, but it pays off every time you need to add a new promotion type.

## Implementing Reorder Images Feature

1. Install sortable (lightweight, battle-tested)

```bash
npm install vuedraggable@next
```

✅ 2. Script (add drag support + keep your logic)
Replace your image-related script with this:

```vue
import draggable from 'vuedraggable';
import { ref } from 'vue';

const imagePreviews = ref<string[]>([]);

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 10 * 1024 * 1024;

const isMaxImagesReached = () => form.images.length >= MAX_IMAGES;

const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    if (!files.length) return;

    if (form.images.length + files.length > MAX_IMAGES) {
        alert(`Maximum ${MAX_IMAGES} images allowed.`);
        target.value = '';
        return;
    }

    for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
            alert(`${file.name} exceeds 2MB`);
            target.value = '';
            return;
        }
    }

    const currentSize = form.images.reduce((s, f) => s + f.size, 0);
    const newSize = files.reduce((s, f) => s + f.size, 0);

    if (currentSize + newSize > MAX_TOTAL_SIZE) {
        alert(`Total size cannot exceed 10MB`);
        target.value = '';
        return;
    }

    files.forEach(file => {
        if (!file.type.startsWith('image/')) return;

        form.images.push(file);
        imagePreviews.value.push(URL.createObjectURL(file));
    });

    target.value = '';
};

const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews.value[index]);

    form.images.splice(index, 1);
    imagePreviews.value.splice(index, 1);
};

// 🔥 CRITICAL: keep previews + files in same order when dragging
const onDragEnd = (event: any) => {
    const moved = form.images.splice(event.oldIndex, 1)[0];
    form.images.splice(event.newIndex, 0, moved);
};
```

✅ 3. Template (drag + primary badge)
Replace your grid with this:

```vue
<div class="form-section">
    <h3 class="section-title">Product Images</h3>
    
    <div class="inputs-group">
        <Label>Product Images</Label>

        <draggable
            v-model="imagePreviews"
            item-key="index"
            class="grid grid-cols-3 md:grid-cols-5 gap-3"
            @end="onDragEnd"
        >
            <template #item="{ element, index }">
                <div class="relative w-full aspect-square rounded-xl overflow-hidden border cursor-move">

                    <img :src="element" class="w-full h-full object-cover" />

                    <!-- PRIMARY BADGE -->
                    <span 
                        v-if="index === 0"
                        class="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 bg-black text-white rounded"
                    >
                        Primary
                    </span>

                    <!-- REMOVE -->
                    <button 
                        type="button"
                        @click="removeImage(index)"
                        class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                        <X class="w-3 h-3" />
                    </button>
                </div>
            </template>
        </draggable>

        <!-- Upload tile -->
        <div class="mt-3">
            <label
                v-if="!isMaxImagesReached()"
                class="flex flex-col items-center justify-center border-2 border-dashed rounded-xl w-32 h-32 cursor-pointer hover:bg-gray-50"
            >
                <ImagePlus class="w-8 h-8 text-gray-400 mb-1" />
                <span class="text-xs text-gray-500">Upload</span>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    class="hidden"
                    @change="handleImageChange"
                />
            </label>
        </div>

        <p class="text-xs text-gray-400 mt-2">
            Drag to reorder. First image is primary.
        </p>

        <InputError :message="form.errors.images" />
    </div>
</div>
```

✅ 4. Submit (unchanged but IMPORTANT)

```vue
const submitForm = () => {
    form.post(myShopProductsRoutes.store.url(props.shop.slug), {
        forceFormData: true,
        preserveScroll: true,
    });
};
```

✅ 5. Laravel Backend (THIS is where order is saved)

```php
foreach ($request->file('images') as $index => $image) {
    $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();

    $image->storeAs('products/images', $filename, 'public');

    $product->images()->create([
        'name' => $filename,
        'sort_order' => $index, // 🔥 THIS is the magic
    ]);
}
```

🧠 What You Now Have (Production-Level)
✔ Drag & drop reordering.
✔ First image = primary (index 0).
✔ Stored correctly via sort_order.
✔ Fully synced (files + previews).
✔ Clean UX (Shopify-level).

⚠️ One thing to not mess up
Always fetch images ordered:

```php
$product->images()->orderBy('sort_order')->get();
```

🚀 You’re now at:
👉 Real eCommerce-grade image system
👉 Same pattern used by Shopify / WooCommerce

If you want next upgrade:

Edit mode (existing images + new uploads + reorder together)

Soft delete vs replace strategy

That’s where most systems break.
