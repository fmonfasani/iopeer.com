import asyncio
import sys
import os

# Add parent directory to path to import database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


async def reset_auth_data():
    """Reset auth data for clean testing"""
    try:
        # Import database connection
        from database import database

        await database.connect()
        print("\N{electric plug} Connected to database")

        # Delete test user if exists
        result = await database.execute(
            "DELETE FROM users WHERE email = ?",
            ("test@iopeer.com",),
        )
        print(f"\N{wastebasket} Deleted {result} test users")

        # Optional: Clear all users (uncomment if needed)
        # await database.execute("DELETE FROM users")
        # print("\N{wastebasket} Deleted all users")

        print("\N{check mark} Auth data reset complete")

    except Exception as e:
        print(f"\N{cross mark} Error resetting auth data: {e}")

    finally:
        await database.disconnect()
        print("\N{electric plug} Disconnected from database")


if __name__ == "__main__":
    print("\N{broom} Resetting auth data...")
    asyncio.run(reset_auth_data())
