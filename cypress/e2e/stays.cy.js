describe('RESERVDNG STAYS UPLOAD', () => {
  const url = 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1094586746#gid=1094586746'

  const range = {
    'start': 10,
    'end': 10
  }

  let stays = []

  before(() => {
    cy.task('readRemoteExcel', url).then((sheets) => {
      const stays_sheet = sheets[0].data

      stays = stays_sheet.slice(range.start + 1, range.end + 2).map((row) => ({
        name: row[2],
        type: row[3],
        bedrooms: row[4],
        bathrooms: row[5],
        guests: row[6],
        email: row[7],
        highlight: row[8],
        description: row[9],
        features: row[10],
        hostName: row[11],
        hostPhone: row[12],
        hostEmail: row[13],
        hostWhatsappNumber: row[14],
        address: row[15],
        city: row[16],
        state: row[17],
        landmarks: row[18],
        transportation: row[19],
        checkInInstruction: row[20],
        checkInTime: row[21],
        checkOutTime: row[22],
        kitchenAmenities: row[23] ? row[25].split(',').map(a => a.trim()) : [],
        livingAmenities: row[24] ? row[25].split(',').map(a => a.trim()) : [],
        bedroomAmenities: row[25] ? row[25].split(',').map(a => a.trim()) : [],
        generalAmenities: row[26] ? row[26].split(',').map(p => p.trim()) : [],
        houseRules: row[27],
        dailyRate: row[28],
        minimumStay: row[29],
        maxStay: row[30],
        advancedBooking: row[31],
        cancellationHighlights: row[32],
        cancellationPolicy: row[33]
      }))
    })

    cy.loginWithEmailAndPassword(Cypress.env('email'), Cypress.env('password'))
  })

  it('UPLOADS ALL STAYS', () => {
    cy.wrap(stays).each((_stay) => {
      cy.visit('/')
      cy.get('span.rounded-full')
        .first()
        .click()
      cy.contains('New Location')
        .click()
      cy.get('[name="_token"]').invoke('attr', 'value')
        .then((_token) => {
          cy.request({
            method: "POST",
            url: "/drafts",
            body: {
              "_token": _token,
              "name": _stay.name ?? "Transcorp Hilton Abuja",
              "type":  _stay.type ?? "apartment",
              "bedrooms": _stay.bedrooms ??  2,
              "bathrooms": _stay.bathrooms ??  2,
              "guests": _stay.guests ??  3,
              "highlight":  _stay.highlight ?? "Elegant and sophisticated, ideal for business and family trips.",
              "description":  _stay.description ?? "Luxurious, classy, and serene with professional service.",
              "features": _stay.features ??  [
                "furnished",
                "serviced",
                "",
                "balcony",
                "garden",
                "pet-friendly"
              ],
              "host_name":  _stay.hostName ?? "Sarah Savon",
              "host_phone": _stay.hostPhone ??  "09023431234",
              "host_email": _stay.hostEmail ??  "host@gmail.com",
              "host_whatsapp": _stay.hostWhatsappNumber ??  "09012341234",
              "host_photo": "(binary)",
              "host-photo-draft": "[base64-encoded PNG image data omitted]",
              "address": _stay.address ??  "Kofo Abayomi St, Victoria Island",
              "city": _stay.city ??  "Victoria Island",
              "state":  _stay.state ?? "Abuja",
              "landmarks": _stay.landmarks ??  "Wegarhjm",
              "transportation": _stay.transportation ??  [
                "airport-shuttle",
                "taxi-service",
                "public-transport",
                "car-rental",
                "valet-parking",
                "self-parking"
              ],
              "checkin_instructions": _stay.checkInInstruction ??  "fgehtjmjgh",
              "checkin_time":  _stay.checkInTime ?? "14:00",
              "checkout_time": _stay.checkOutTime ??  "11:00",
              "kitchen_amenities": _stay.kitchenAmenities ??  [
                "full-kitchen",
                "kitchenette",
                "microwave",
                "refrigerator",
                "dishwasher",
                "coffee-maker",
                "dining-table",
                "cookware"
              ],
              "living_amenities": _stay.livingAmenities ??  [
                "tv",
                "cable-tv",
                "netflix",
                "sound-system",
                "gaming-console",
                "books",
                "workspace",
                "fireplace"
              ],
              "bedroom_amenities": _stay.bedroomAmenities ??  [
                "ac",
                "heating",
                "wardrobe",
                "safe",
                "hair-dryer",
                "towels",
                "bed-linen",
                "toiletries"
              ],
              "general_amenities": _stay.name ??  [
                "wifi",
                "generator",
                "washing-machine",
                "iron",
                "elevator",
                "security",
                "pool",
                "gym"
              ],
              "house_rules": _stay.houseRules ??  "agehfngjergh",
              "daily_rate": _stay.dailyRate ??  239999,
              "caution_fee":   20000,
              "weekly_rate":  null,
              "monthly_rate": null,
              "min_stay": _stay.minimumStay ??  1,
              "max_stay": _stay.maxStay ??  4,
              "min_advance_booking": 1,
              "max_advance_booking": 9,
              "cancellation_highlight": _stay.cancellationHighlights ??  "fsdgdhfncjv",
              "cancellation_policy":  _stay.cancellationPolicy ?? "sfdgxhcjm,kj",
              "_method": "POST",
              "draft_type": "Add Stay"
            }
          })
        })
      cy.wait(3000)

      cy.get('.grid.gap-8 .p-6')
        .eq(2)
        .click()
      cy.get('[type="file"]')
        .each(($input) => cy.wrap($input).selectFile('cypress/fixtures/hotel.jpg', { force: true }))

      cy.contains('Continue')
        .click({ force: true })
      cy.get('[onclick="nextStep()"]')
        .click({ multiple: true, force: true })
      cy.contains('Submit')
        .click()
      cy.wait(10000)
    })
  })
})