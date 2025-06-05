import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False
    # Set to True if using HTTPS
    SESSION_COOKIE_SECURE = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    """Testing configuration."""
    DEBUG = True
    TESTING = True

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
