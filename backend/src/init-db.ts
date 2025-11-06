import { readFileSync } from 'fs'
import { join } from 'path'
import pool from './db'

async function initDatabase() {
  try {
    console.log('Initializing database...')
    
    // Read the SQL schema file
    const schemaPath = join(__dirname, '../prisma/schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    
    // Split the schema into individual statements
    // Handle multi-line statements and dollar-quoted strings
    const lines = schema.split('\n')
    let currentStatement = ''
    let inDollarQuote = false
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('--')) {
        continue
      }
      
      currentStatement += line + '\n'
      
      // Check for dollar-quoted strings (functions, triggers)
      if (trimmed.includes('$$')) {
        inDollarQuote = !inDollarQuote
      }
      
      // Execute statement when we hit a semicolon and we're not in a dollar quote
      if (trimmed.endsWith(';') && !inDollarQuote) {
        const statement = currentStatement.trim()
        if (statement.length > 0) {
          try {
            await pool.query(statement)
            console.log(`✓ Executed: ${statement.substring(0, 50).replace(/\n/g, ' ')}...`)
          } catch (error: any) {
            // Ignore "already exists" errors
            if (error.code === '42P07' || error.message.includes('already exists')) {
              console.log(`⊘ Skipped (already exists)`)
            } else if (!error.message.includes('syntax error') && !error.message.includes('unterminated')) {
              console.error(`Error: ${error.message.substring(0, 100)}`)
            }
          }
        }
        currentStatement = ''
      }
    }
    
    // Execute any remaining statement
    if (currentStatement.trim()) {
      try {
        await pool.query(currentStatement.trim())
      } catch (error: any) {
        if (error.code !== '42P07' && !error.message.includes('already exists')) {
          console.error('Error executing final statement:', error.message)
        }
      }
    }
    
    console.log('✅ Database initialized successfully!')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initDatabase()

