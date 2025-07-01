
UPDATE store_settings
SET admin_password = 'alshbh01278006248alshbh'
WHERE id IS NOT NULL;

-- If no rows exist, insert default settings with new password
INSERT INTO store_settings (id, store_name, welcome_image, admin_password, theme_id)
SELECT 'default', 'متجر البرندات', '/placeholder.svg', 'alshbh01278006248alshbh', 1
WHERE NOT EXISTS (SELECT 1 FROM store_settings);
