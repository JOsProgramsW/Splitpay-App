CREATE DATABASE SplitPayDB;
GO
USE SplitPayDB;
GO

CREATE TABLE Grupos (
    GrupoId INT PRIMARY KEY IDENTITY(1,1),
    NombreGrupo VARCHAR(100) NOT NULL,
    CodigoInvitacion VARCHAR(10) NOT NULL UNIQUE,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Usuarios (
    UsuarioId INT PRIMARY KEY IDENTITY(1,1),
    GrupoId INT NOT NULL FOREIGN KEY REFERENCES Grupos(GrupoId),
    NombreCompleto VARCHAR(120) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Rol VARCHAR(20) NOT NULL CHECK (Rol IN ('Admin', 'Miembro'))
);

CREATE TABLE GastosComunes (
    GastoId INT PRIMARY KEY IDENTITY(1,1),
    GrupoId INT NOT NULL FOREIGN KEY REFERENCES Grupos(GrupoId),
    CreadoPorId INT NOT NULL FOREIGN KEY REFERENCES Usuarios(UsuarioId),
    Concepto VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(300) NULL,
    MontoTotal DECIMAL(10,2) NOT NULL CHECK (MontoTotal > 0),
    FechaGasto DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE CuotasIndividuales (
    CuotaId INT PRIMARY KEY IDENTITY(1,1),
    GastoId INT NOT NULL FOREIGN KEY REFERENCES GastosComunes(GastoId) ON DELETE CASCADE,
    UsuarioId INT NOT NULL FOREIGN KEY REFERENCES Usuarios(UsuarioId),
    MontoAsignado DECIMAL(10,2) NOT NULL CHECK (MontoAsignado > 0),
    EstadoPago VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (EstadoPago IN ('Pendiente', 'EnRevision', 'Pagado'))
);

CREATE TABLE PagosRegistrados (
    PagoId INT PRIMARY KEY IDENTITY(1,1),
    CuotaId INT NOT NULL FOREIGN KEY REFERENCES CuotasIndividuales(CuotaId),
    UsuarioId INT NOT NULL FOREIGN KEY REFERENCES Usuarios(UsuarioId),
    MontoPagado DECIMAL(10,2) NOT NULL,
    MetodoPago VARCHAR(30) NOT NULL CHECK (MetodoPago IN ('Transferencia', 'Efectivo')),
    ReferenciaFolio VARCHAR(80) NOT NULL,
    EstadoValidacion VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (EstadoValidacion IN ('Pendiente', 'Aprobado', 'Rechazado')),
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);