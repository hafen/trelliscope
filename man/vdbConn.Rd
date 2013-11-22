\name{vdbConn}
\alias{vdbConn}
\title{Connect to a VDB}
\usage{
  vdbConn(path, name = NULL, autoYes = FALSE,
    reset = FALSE, verbose = TRUE)
}
\arguments{
  \item{path}{The path on the local file system where the
  directory for the VDB is located}

  \item{name}{the name for the VDB (if null, uses the name
  of the parent directory)}

  \item{autoYes}{should questions to proceed with directory
  creation operations be automatically answered with
  "yes"?}

  \item{reset}{should existing metadata for this VDB
  connection be overwritten?}

  \item{verbose}{logical - print messages about what is
  being done}
}
\description{
  Connect to a visualization catabase
}
\author{
  Ryan Hafen
}
\seealso{
  \code{\link{updateViewer}}
}
