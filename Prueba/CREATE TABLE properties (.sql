CREATE TABLE properties (
    id INT PRIMARY KEY,
    address VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    size_sqft INT NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    terrain_type VARCHAR(50) NOT NULL,
    is_offer TINYINT(1) NOT NULL,
    discount FLOAT NOT NULL,
    property_description TEXT NOT NULL, 
    details JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
