from flask import Flask
from .extensions import db, jwt, cors, migrate
from .config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    # Registrar blueprints
    from .routes.auth_routes import auth_bp
    from .routes.estudiante_routes import estudiante_bp
    from .routes.empresa_routes import empresa_bp
    from .routes.vacante_routes import vacante_bp
    from .routes.postulacion_routes import postulacion_bp
    from .routes.matching_routes import matching_bp
    from .routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(estudiante_bp, url_prefix='/api/estudiantes')
    app.register_blueprint(empresa_bp, url_prefix='/api/empresas')
    app.register_blueprint(vacante_bp, url_prefix='/api/vacantes')
    app.register_blueprint(postulacion_bp, url_prefix='/api/postulaciones')
    app.register_blueprint(matching_bp, url_prefix='/api/matching')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    return app
