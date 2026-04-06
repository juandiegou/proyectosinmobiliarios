from jose import jwt, JWTError
from fastapi.responses import JSONResponse
from datetime import datetime

def validate_token(token, secret_key, audience=None, issuer=None):
    try:
        header = jwt.get_unverified_header(token)
        payload = jwt.decode(token, secret_key, algorithms=[header['alg']])
        exp = payload.get('exp')
        if exp is not None and datetime.utcnow() > datetime.utcfromtimestamp(exp):
            raise JWTError('Token has expired')
        return payload

    except JWTError:
       return JSONResponse(status_code=500,content={"detail": "Invalid Token"})