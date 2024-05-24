CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    starting_price INT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    auction_start_time TIMESTAMP,
    main_category VARCHAR(255),
    sub_category VARCHAR(255),
    status TEXT DEFAULT "unsold"
    sold_to TEXT,
    sold_at INT
);

CREATE TABLE auction_results (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    buyer VARCHAR(255) NOT NULL,
    bids JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
