"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
async function updateSchema() {
    try {
        console.log('📝 Creating Order and OrderItem tables...');
        // Create Order table
        await db_1.default.query(`
      CREATE TABLE IF NOT EXISTS "Order" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "total" DOUBLE PRECISION NOT NULL,
        status TEXT DEFAULT 'pending',
        "shippingName" TEXT NOT NULL,
        "shippingEmail" TEXT NOT NULL,
        "shippingAddress" TEXT NOT NULL,
        "shippingCity" TEXT NOT NULL,
        "shippingState" TEXT NOT NULL,
        "shippingZip" TEXT NOT NULL,
        "shippingCountry" TEXT NOT NULL,
        "shippingPhone" TEXT NOT NULL,
        "paymentMethod" TEXT DEFAULT 'card',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
      );
    `);
        console.log('✅ Order table created/verified');
        // Create OrderItem table
        await db_1.default.query(`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        id TEXT PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "productName" TEXT NOT NULL,
        "productPrice" DOUBLE PRECISION NOT NULL,
        "productImage" TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE,
        CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE SET NULL
      );
    `);
        console.log('✅ OrderItem table created/verified');
        // Create indexes
        await db_1.default.query(`CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");`);
        await db_1.default.query(`CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");`);
        await db_1.default.query(`CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId");`);
        console.log('✅ Indexes created/verified');
        // Create triggers
        try {
            await db_1.default.query(`
        CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "Order"
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
        }
        catch (error) {
            if (!error.message.includes('already exists')) {
                console.log('⚠️  Order trigger:', error.message);
            }
        }
        try {
            await db_1.default.query(`
        CREATE TRIGGER update_order_item_updated_at BEFORE UPDATE ON "OrderItem"
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
        }
        catch (error) {
            if (!error.message.includes('already exists')) {
                console.log('⚠️  OrderItem trigger:', error.message);
            }
        }
        console.log('✅ Triggers created/verified');
        console.log('🎉 Database schema updated successfully!');
        console.log('📦 Order and OrderItem tables are ready!');
    }
    catch (error) {
        console.error('❌ Error updating schema:', error);
        process.exit(1);
    }
    finally {
        await db_1.default.end();
    }
}
updateSchema();
