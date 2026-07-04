---
title: "Laravel"
description: "Laravel Notes"
pubDate: "July 04 2026"
heroImage: "../../../assets/blog-placeholder.jpg"
categories: ['projects', 'laravel']
---

## Workflow

- migration: define the structure.
- model: define relationships and fillable fields.
- request: define validation rules.
- controller: handle http requests.
- resource: define API response structure (controls the json response (what the API returns)).
- routes: register endpoints.
- factory: generate fake data for testing.
- test: verify everything works.

## AI Instructions

- Create the migration.
- Create the model.
- Create the request.
- Create the controller: Use proper import like (use Exception instead of \Exception).
- Create the resource.
- Create the factory.
- Create the routes: Use explicit routes instead of shortcuts like (apiResource()).
- Create the tests: Ensure the tests are meticulous and robust.

## Using Tinker

Creating a test record.

```php
# Create a test shop for your user (run in tinker)
php artisan tinker

>>> $user = User::first();
>>> $shop = Shop::create([
    'user_id' => $user->id,
    'name' => 'Amani Botanics',
    'slug' => 'amani-botanics',
    'description' => 'Handcrafted botanical skincare',
    'category' => 'Beauty & Wellness',
    'contact_email' => 'hello@amanibotanics.com'
]);
```

## Laravel Reverb

Installation.

```bash
composer require laravel/reverb
php artisan reverb:install
```

Configuration.

```php
// config/reverb.php
return [
    'apps' => [
        [
            'id' => env('REVERB_APP_ID'),
            'key' => env('REVERB_APP_KEY'),
            'secret' => env('REVERB_APP_SECRET'),
            'host' => env('REVERB_HOST'),
            'port' => env('REVERB_PORT', 8080),
            'scheme' => env('REVERB_SCHEME', 'http'),
        ],
    ],
];
```

Creating Events.

```bash
php artisan make:event NewPostEvent
php artisan make:event NewCommentEvent
php artisan make:event NewMessageEvent
php artisan make:event ShopTypingEvent
php artisan make:event PostLikedEvent
```

```php
// app/Events/NewPostEvent.php
<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewPostEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $post;
    
    public function __construct(Post $post)
    {
        $this->post = $post->load('shop');
    }
    
    public function broadcastOn()
    {
        return new Channel('community.posts');
    }
    
    public function broadcastAs()
    {
        return 'new-post';
    }
    
    public function broadcastWith()
    {
        return [
            'post' => [
                'id' => $this->post->id,
                'content' => $this->post->content,
                'shop' => [
                    'id' => $this->post->shop->id,
                    'name' => $this->post->shop->name,
                    'logo' => $this->post->shop->logo,
                ],
                'likes_count' => $this->post->likes_count,
                'comments_count' => $this->post->comments_count,
                'published_at' => $this->post->published_at->diffForHumans(),
            ]
        ];
    }
}


// app/Events/NewMessageEvent.php
<?php
namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $message;
    
    public function __construct(ChatMessage $message)
    {
        $this->message = $message->load('sender', 'receiver');
    }
    
    public function broadcastOn()
    {
        // Send to both sender and receiver
        return [
            new PrivateChannel('chat.shop.' . $this->message->sender_shop_id),
            new PrivateChannel('chat.shop.' . $this->message->receiver_shop_id),
        ];
    }
    
    public function broadcastAs()
    {
        return 'new-message';
    }
    
    public function broadcastWith()
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'message' => $this->message->message,
                'sender' => [
                    'id' => $this->message->sender->id,
                    'name' => $this->message->sender->name,
                ],
                'created_at' => $this->message->created_at->diffForHumans(),
            ]
        ];
    }
}
```

Configure broadcasting.

```php
// config/broadcasting.php
'connections' => [
    'reverb' => [
        'driver' => 'reverb',
        'key' => env('REVERB_APP_KEY'),
        'secret' => env('REVERB_APP_SECRET'),
        'app_id' => env('REVERB_APP_ID'),
        'options' => [
            'host' => env('REVERB_HOST'),
            'port' => env('REVERB_PORT', 8080),
            'scheme' => env('REVERB_SCHEME', 'http'),
        ],
    ],
],
```

Setup echo on the frontend.

```php
npm install laravel-echo pusher-js
```

```js
// resources/js/echo.js
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
})

export default echo;


// resources/js/app.js
import './bootstrap'
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ZiggyVue } from '../../vendor/tightenco/ziggy'
import echo from './echo'

createInertiaApp({
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
        app.use(plugin)
        app.use(ZiggyVue)
        app.config.globalProperties.$echo = echo
        app.mount(el)
    },
})
```
