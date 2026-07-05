import base64
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

# HTTPBearer extracts the Authorization: Bearer <token> header automatically
security = HTTPBearer(auto_error=False)

def get_jwks_url() -> str:
    """
    Resolve the Clerk JWKS URL. First checks CLERK_JWKS_URL.
    If not set, attempts to decode CLERK_PUBLISHABLE_KEY to extract the domain.
    """
    if settings.CLERK_JWKS_URL:
        return settings.CLERK_JWKS_URL
        
    if settings.CLERK_PUBLISHABLE_KEY:
        try:
            # Clerk publishable key format: pk_test_Y2xlYW4tbW9sbHktNjAuY2xlcmsuYWNjb3VudHMuZGV2JA
            parts = settings.CLERK_PUBLISHABLE_KEY.split('_')
            if len(parts) >= 3:
                key_b64 = parts[2]
                # Pad base64 if necessary
                key_b64 += "=" * ((4 - len(key_b64) % 4) % 4)
                decoded = base64.b64decode(key_b64).decode('utf-8')
                domain = decoded.rstrip('$')
                return f"https://{domain}/.well-known/jwks.json"
        except Exception as e:
            print(f"Error parsing CLERK_PUBLISHABLE_KEY: {e}")
            
    # Fallback to local mockup JWKS URL or raise error in production
    return "https://clerk.accounts.dev/.well-known/jwks.json"

# Initialize PyJWKClient with Clerk's JWKS endpoint
# It handles caching and fetching JWKS keys automatically under the hood
jwks_url = get_jwks_url()
jwks_client = PyJWKClient(jwks_url) if jwks_url else None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    FastAPI dependency to validate Clerk session tokens (JWT).
    Verifies token signature using Clerk's public keys.
    Returns the decoded token claims.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = credentials.credentials
    
    if not jwks_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication client not configured. Set CLERK_PUBLISHABLE_KEY or CLERK_JWKS_URL.",
        )
        
    try:
        # Retrieve the public key corresponding to the token's kid
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Decode and verify the token signature
        # We skip audience verification because Clerk's standard session JWTs 
        # do not include the aud claim by default unless a custom template is defined.
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
