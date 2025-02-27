import os
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client


class SupabaseSingleton:
    """
    Singleton class for Supabase client.
    Ensures only one instance of the Supabase client is created.
    """
    _instance: Optional["SupabaseSingleton"] = None
    _client: Optional[Client] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseSingleton, cls).__new__(cls)
            cls._instance._initialize_client()
        return cls._instance

    def _initialize_client(self):
        """Initialize the Supabase client with credentials from environment variables."""
        load_dotenv()
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")

        if not supabase_url or not supabase_key:
            raise ValueError(
                "SUPABASE_URL and SUPABASE_KEY environment variables must be set"
            )

        self._client = create_client(supabase_url, supabase_key)

    @property
    def client(self) -> Client:
        """Get the Supabase client instance."""
        if self._client is None:
            self._initialize_client()
        return self._client

    @property
    def storage(self):
        """Direct access to the storage functionality."""
        return self.client.storage


# Create a singleton instance to be imported and used across the application
supabase = SupabaseSingleton()
