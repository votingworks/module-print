# Print Module

This web server component provides a web interface to connected printers.

## Install Requisite Software & Configuration

1. `make install` on Linux to install requisite CUPS package
1. Install NodeJS LTS from https://nodejs.org/
1. Install Yarn package manager from https://yarnpkg.com/
1. `yarn install` to install packages
1. Make sure you have designated a default printer on your system

## Run Tests

```sh
$ yarn test
```

## Start the Development Server

```sh
# start on the default port (3005)
$ yarn start
# start on custom port
$ PORT=8080 yarn start
```

### Endpoints

#### `POST /printer/jobs/new`

Create a new print job for the default printer with the content of the request
body. Use the `Content-Type` header to choose the print format. Responds with an
ID for the print job.

**Example: Printing a PDF file**

```sh
$ curl \
  --request POST \
  --header 'Content-Type: application/pdf' \
  --data-binary @path/to/file.pdf \
  http://localhost:${PORT}/printer/jobs/new
{"id":"43a55850-c84c-11e9-aff5-bf39225c9e96"}
```

**Example: Printing an HTML file**

> Note: Printing HTML requires Google Chrome to be installed.

```sh
$ curl \
  --request POST \
  --header 'Content-Type: text/html' \
  --header 'Referer: http://localhost:3000/print' \
  --data-binary @path/to/file.html \
  http://localhost:${PORT}/printer/jobs/new
{"id":"e96d9590-c851-11e9-a465-1ba11bc8aa67"}
```

#### `GET /printer/status`

Responds with a static value just so you can verify the server is running.

```sh
$ curl http://localhost:${PORT}/printer/status
```

## Mock a Printer

There is no functionality for mocking printers, but you can use system utilities
to get a similar effect:

### Default Printer

Several other system utilities use the printer name, so you may want to get the
default printer name.

```sh
# get the default printer
$ lpstat -d
system default destination: Brother_HL_L2300D_series
```

### Disable/Enable a Printer

Disabling a printer means you can still send print jobs to it, but they won't
actually go to the printer. Think of it as pausing, and re-enabling as resuming.

```sh
# disable a printer by name
$ cupsdisable Brother_HL_L2300D_series
# disable the default printer
$ cupsdisable $(lpstat -d | cut -d' ' -f 4)
# use `cupsenable` to resume printing
$ cupsenable $(lpstat -d | cut -d' ' -f 4)
```

### Inspect the Print Queue

```sh
$ lpq
Brother_HL_L2300D_series is not ready
Rank    Owner   Job     File(s)                         Total Size
1st     donovan 45      5a7db340-c835-11e9-a4c5-a194fca 377856 bytes
```

### Cancel a Print Job

```sh
# list print jobs to get an id
$ lpq
Brother_HL_L2300D_series is not ready
Rank    Owner   Job     File(s)                         Total Size
1st     donovan 45      5a7db340-c835-11e9-a4c5-a194fca 377856 bytes
# cancel a job by id
$ cancel 45
# or cancel all print jobs
$ lprm -
```

### macOS GUI

In macOS the above works, but you can also use the GUI to pause/resume printing
and to view/edit the print queue. This is nice since it'll also show you a
preview of what would be printed.
