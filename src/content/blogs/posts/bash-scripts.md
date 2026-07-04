---
title: "Bash Scripts"
description: "Bash Scripting"
pubDate: "July 04 2026"
heroImage: "../../../assets/blog-placeholder.jpg"
categories: ['bash script']
---

## Script Ideas

### Laravel Operations

a:config-pgsql              # ⚠️ Has prompt for db_name
a:mod-users-migration
a:make-UserRoles-enum

#### Laravel TODOs

##### 1. Make Full Model

Creates: model + migration + factory + seeder + controller + resource + request.

```bash
aaqilify-make:full-model Blog
```

##### 2. Make Enum with cases (interactive)

Prompts for: enum name and cases.

This would return:

```text
# Enter enum name: PaymentStatus
# Enter cases (comma separated): pending, processing, completed, failed
```

```bash
aaqilify-make:enum
```

##### 3. Make CRUD with views

Creates complement CRUD with Blade views.

This creates: Controller, Requests, Views (index/create/edit/show), Routes

```bash
aaqilify-make:crud Product
```

##### 4. Make Repository Pattern

Creates Repository and Interface with base methods.

Creates: UserRepositoryInterface, UserRepository, binds in service provider.

```bash
aaqilify-make:repository User
```

##### 5. Make Action Class

Creates Laravel Action class with invoke method.

Creates: app/Actions/ProcessOrder.php with handle() method.

```bash
aqilify-make:action ProcessOrder
```

##### 6. Make DTO (Data Transfer Object)

Creates DTO with properties, constructor, and fromArray/toArray.

```bash
aqilify-make:dto UserData
```

##### 7. Add Role to User (After enum exists)

Adds role column migration + trait to User model.

Creates migration, adds HasRoles trait, updates User model.

```bash
aqilify-add:roles-to-user
```

##### 8. Make API Resource Collection

Creates API Resource with relationships included.

Creates: PostResource, PostCollection with proper formatting

```bash
aqilify-make:api-resource Post
```

##### 9. Make Service Class

Creates service with CRUD methods.

Creates: UserService with getAll, find, create, update, delete.

```bash
aqilify-make:service UserService
```

##### 10. Make Notification with Channels

Creates notification pre-configured with mail, database, broadcast.

```bash
aqilify-make:notification WelcomeUser
```

## Scripts

### Aqilify Help

```bash
#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

show_main_help() {
    echo ""
    echo -e "${BOLD}Aqilify - Custom Commands${NC}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC} aaqilify:<command> [arguments] [options]"
    echo ""
    echo -e "${BLUE}Available Commands:${NC}"
    echo ""
    printf "  ${GREEN}%-30s${NC} %s\n" "a:config-pgsql <database_name>" "Configure Laravel for PostgreSQL database"
    printf "  ${GREEN}%-30s${NC} %s\n" "a:make-UserRoles-enum" "Create UserRoles enum with: SUPER_ADMIN, ADMIN, USER"
    printf "  ${GREEN}%-30s${NC} %s\n" "a:mod-user-migration" "Modify user migration file to add necessary fields"
    echo ""
    echo -e "${BLUE}For detailed help on a specific command:${NC}"
    echo -e "  ${YELLOW}a:config-pgsql --help${NC}"
    echo -e "  ${YELLOW}a:make-UserRoles-enum --help${NC}"
    echo -e "  ${YELLOW}a:mod-user-migration --help${NC}"
    echo ""
}

if [ $# -eq 0 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_main_help
    exit 0
fi

COMMAND="$1"
shift
SCRIPT_PATH="/home/aaqil/Aaqil/Development/scripts/aqilify-$COMMAND"

if [ -f "$SCRIPT_PATH" ]; then
    bash "$SCRIPT_PATH" "$@"
else
    echo -e "${RED}Unknown command: $COMMAND${NC}"
    echo "Run 'aqilify --help' for available commands"
    exit 1
fi
```

### Config pgsl in laravel

```bash
#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    cat << 'EOF'
a:config-pgsql - Configure Laravel for PostgreSQL database

USAGE:
    a:config-pgsql <database_name> [username] [password]

EXAMPLES:
    a:config-pgsql blogs_db
EOF
    exit 0
fi

if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Database name is required${NC}"
    exit 1
fi

# First argument: database name (required)
DB_NAME=$1
# Second argument: database username (optional, defaults to 'postgres')
DB_USER=${2:-postgres}
# Third argument: database password (optional, defaults to 'root')
DB_PASS=${3:-root}

echo -e "${GREEN}🐘 Configuring Laravel for PostgreSQL...${NC}"

# Check if we're in a Laravel project
if [ ! -f "artisan" ] || [ ! -f ".env" ]; then
    echo -e "${RED}❌ Not a Laravel project root or .env not found!${NC}"
    echo -e "${YELLOW}Please run this from your Laravel project root${NC}"
    exit 1
fi

# First, set DB_CONNECTION
sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=pgsql/' .env

# Handle DB_HOST - matches "# DB_HOST=" | "#DB_HOST=" | "DB_HOST="
sed -i 's/^# DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i 's/^#DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i 's/^DB_HOST=.*/DB_HOST=127.0.0.1/' .env

# Handle DB_PORT
sed -i 's/^# DB_PORT=.*/DB_PORT=5432/' .env
sed -i 's/^#DB_PORT=.*/DB_PORT=5432/' .env
sed -i 's/^DB_PORT=.*/DB_PORT=5432/' .env

# Handle DB_DATABASE
sed -i "s/^# DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
sed -i "s/^#DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env

# Handle DB_USERNAME
sed -i "s/^# DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
sed -i "s/^#DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env

# Handle DB_PASSWORD
sed -i "s/^# DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" .env
sed -i "s/^#DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" .env
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" .env

echo -e "${GREEN}✅ Done${NC}"
grep "^DB_" .env
```

### Make User Enums in Laravel

```bash
#!/usr/bin/env bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Show help if requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    cat << 'EOF'
a:make-UserRoles-enum - Create UserRoles enum for Laravel

USAGE:
    a:make-UserRoles-enum

DESCRIPTION:
    Creates a UserRoles enum file in app/Enums/UserRoles.php with three roles:
    - SUPER_ADMIN (value: 0)
    - ADMIN (value: 1)
    - USER (value: 2)
    
    The enum includes helper methods:
    - label(): Get human-readable label for a role
    - labels(): Get array of all labels keyed by value
    - tryFromLabel(): Find enum by label name (case-insensitive)

BEHAVIOR:
    - Creates app/Enums/ directory if it doesn't exist
    - Prompts before overwriting existing file
    - Shows a preview of the first 15 lines after creation

EXAMPLES:
    # Create the UserRoles enum
    a:make-UserRoles-enum

NOTES:
    Must be run from Laravel project root (where artisan is)
    Uses integer backing values (0, 1, 2) for database storage
EOF
    exit 0
fi

# Function to create UserRoles enum
make_user_roles() {
    echo -e "${GREEN}🚀 Creating UserRoles Enum...${NC}"
    
    # Define paths
    ENUMS_DIR="app/Enums"
    ENUM_FILE="$ENUMS_DIR/UserRoles.php"
    
    # Check if Enums directory exists, create if not
    if [ ! -d "$ENUMS_DIR" ]; then
        echo -e "${YELLOW}📁 Enums directory not found. Creating...${NC}"
        mkdir -p "$ENUMS_DIR"
        echo -e "${GREEN}✅ Enums directory created${NC}"
    else
        echo -e "${GREEN}✅ Enums directory already exists${NC}"
    fi
    
    # Check if UserRoles enum already exists
    if [ -f "$ENUM_FILE" ]; then
        echo -e "${RED}⚠️  UserRoles.php already exists!${NC}"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}❌ Operation cancelled${NC}"
            return 1
        fi
    fi
    
    # Create the UserRoles enum file
    cat > "$ENUM_FILE" << 'EOF'
<?php

namespace App\Enums;

enum UserRoles: int
{
    case SUPER_ADMIN = 0;
    case ADMIN = 1;
    case USER = 2;

    public function label(): string
    {
        return match($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::ADMIN => 'Admin',
            self::USER => 'User',
        };
    }

    public static function labels():array
    {
        $labels = [];

        foreach(self::cases() as $role) {
            $labels[$role->value] = $role->label();
        }

        return $labels;
    }

    public static function tryFromLabel(string $label): ?self
    {
        foreach (self::cases() as $role) {
            if (strtolower($role->label()) === strtolower(trim($label))) {
                return $role;
            }
        }
        return null;
    }
}

EOF
    
    echo -e "${GREEN}✅ UserRoles enum created successfully at: $ENUM_FILE${NC}"
    
    # Optional: Show the created file content preview
    echo -e "${YELLOW}📄 Preview:${NC}"
    head -n 15 "$ENUM_FILE"
    echo "..."
}

# Run the function
make_user_roles
```

## EOF

File ends here
