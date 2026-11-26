describe('RESERVDNG CLUBS UPLOAD', { testIsolation: false }, () => {
  const url = 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1538813178#gid=1538813178'

  const range = {
    'start': 1,
    'end': 10
  }

  let clubs: Array<Record<string, any>> = []
  let token: string

  before(() => {
    // cy.clearAllSessionStorage()
    // cy.clearAllLocalStorage()
    cy.task<Array<{ name: string; data: any[][] }>>('readRemoteExcel', url).then((sheets) => {
      const clubs_sheet = sheets[0]?.data ?? []
      clubs = clubs_sheet.slice(range.start + 3, range.end + 4).map((row) => ({
        name: row[2],
        highlight: row[3],
        address: row[4],
        city: row[5],
        state: row[6],
        minimumAverageSpending: row[7],
        email: row[8],
        phone: row[9] ? String(row[9]).split(',').map((a: string) => a.trim()) : [],
        website: row[10],
        instagram: row[11],
        entryPolicy: row[12],
        amenities: row[13],
        landmarks: row[17],
        transportation: row[18] ? String(row[18]).split(',').map((a: string) => a.trim()) : [],
        checkInInstruction: row[19] ?? 'Some default instruction',
        checkInTime: row[20],
        checkOutTime: row[21],
        kitchenAmenities: row[22] ? String(row[22]).split(',').map((a: string) => a.trim()) : [],
        livingAmenities: row[23] ? String(row[23]).split(',').map((a: string) => a.trim()) : [],
        bedroomAmenities: row[24] ? String(row[24]).split(',').map((a: string) => a.trim()) : [],
        generalAmenities: row[25] ? String(row[25]).split(',').map((p: string) => p.trim()) : [],
        houseRules: row[26],
        dailyRate: row[27],
        minimumStay: row[28],
        maxStay: row[29],
        advancedBooking: row[30],
        cancellationHighlights: row[31],
        cancellationPolicy: row[32],
        cautionFee: row[33]
      }))
    })

    cy.env<{ EMAIL?: string; PASSWORD?: string }>(['EMAIL', 'PASSWORD']).then(({ EMAIL, PASSWORD }) => {
      if (!EMAIL || !PASSWORD) {
        throw new Error('Missing EMAIL or PASSWORD in Cypress environment. Check the project .env file.');
      }

      return cy.loginWithEmailAndPassword(EMAIL, PASSWORD);
    });


  })

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (/(step|opt|s) is not defined/.test(err.message)) {
        return false;
      }
    });
  })

  it('UPLOADS ALL clubs', () => {
    cy.wrap(clubs).each((_stay: any) => {
      cy.visit('/clubs/create')
      cy.get('input[name="_token"]').invoke('val').then((value) => {
        token = value?.toString() ?? ''
      })

      cy.getCookie('XSRF-TOKEN').then((xsrfCookie) => {
        cy.getCookie('reservdng_session').then((sessionCookie) => {
          const decodedToken = decodeURIComponent(xsrfCookie!.value)

          cy.task('multipartNestedRequest', {
            url: 'https://reservdng.com/clubs',
            headers: {
              'X-XSRF-TOKEN': decodeURIComponent(xsrfCookie!.value),
              'X-CSRF-TOKEN': token,
              'x-csrf-token': token,
              'Cookie': `XSRF-TOKEN=${xsrfCookie!.value}; reservdng_session=${sessionCookie!.value}`,
            },
            fields: {
              "name": "zdfas",
              "highlight": "asdfsafs",
              "address": "dfgeb",
              "city": "dsfa",
              "state": "Lagos",
              "minimum_average_spending": 12344,
              "description": "awfdgbdfadsfghfs asfdsfasfsaf asfasfasfsafsafasfasfasfsfa sfas fas f as f s fsa fs  f as",
              "email": "someone@mailinator.com",
              "phone": "09123421234",
              "website": "",
              "instagram": "",
              "entry_policy": "srdfxhgjbklm;lm;knjbhvgcfdgxfchvjbknl",
              "amenities": [
                "wifi",
                "parking",
                "security",
                "accessible",
                "air-conditioning",
                "bar",
                "lounge",
                "dance-floor",
                "terrace",
                "rooftop",
                "outdoor-area",
                "private-room",
                "vip",
                "live-music",
                "dj",
                "karaoke",
                "entertainment",
                "sports-screening",
                "table-service",
                "bottle-service",
                "food-menu",
                "cocktails",
                "restaurant",
                "big-screen",
                "event-hosting",
                "private-events",
                "birthday-events",
                "group-bookings",
                "table-reservation",
                "non-smoking-area",
                "smoking-area",
                "cloakroom",
                "restrooms",
                "charging-stations",
                "generator",
                "backup-power",
                "cctv",
                "fire-extinguisher",
                "first-aid-kit",
                "smoke-alarm",
                "emergency-exit"
              ],
              "hours": [
                { "day": "Monday", "open": "11:50", "close": "11:51", "closed": 0 },
                { "day": "Tuesday", "open": "11:50", "close": "11:54", "closed": 0 },
                { "day": "Wednesday", "open": "11:50", "close": "11:54", "closed": 0 },
                { "day": "Thursday", "open": "11:50", "close": "11:54", "closed": 0 },
                { "day": "Friday", "open": "11:51", "close": "11:54", "closed": 0 },
                { "day": "Saturday", "open": "11:51", "close": "11:54", "closed": 0 },
                { "day": "Sunday", "open": "11:51", "close": "11:55", "closed": 0 }
              ],
              "photos": [
                "(binary)"
              ],
              "events": [
                {
                  "name": "dxfcgbhjkl",
                  "start_date": "2026-12-05",
                  "end_date": "2027-01-09",
                  "time": "11:52",
                  "ticket_price": 4567890,
                  "dress_code": "fcghjlbknm",
                  "ticket_link": "",
                }
              ]
            },
            files: {
              "host_photo": 'cypress/fixtures/host/hotel.jpg',
              'photos': ['cypress/fixtures/hotel.jpg'],
              'events[0][flyer]': 'cypress/fixtures/hotel.jpg',

            },
          }).then((result: any) => {
            cy.log(JSON.stringify(result.body, null, 2))
            console.log(result.body)
          })
        })
      })

      cy.visit(`/clubs/${_stay.name.toLowerCase().trim().replace(/\s+/g, '-')}`);

      cy.wait(10000)
    })
  })
})