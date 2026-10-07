describe('RESERVDNG STAYS UPLOAD', { testIsolation: false }, () => {
  const url = 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1094586746#gid=1094586746'

  const range = {
    'start': 10,
    'end': 10
  }

  let stays: Array<Record<string, any>> = []
  let token: string;

  before(() => {
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
    cy.task<Array<{ name: string; data: any[][] }>>('readRemoteExcel', url).then((sheets) => {
      const stays_sheet = sheets[0]?.data ?? []

      stays = stays_sheet.slice(range.start + 1, range.end + 2).map((row) => ({
        name: row[2],
        type: row[3],
        bedrooms: row[4],
        bathrooms: row[5],
        guests: row[6],
        highlight: row[7],
        description: row[8],
        features: row[9] ? String(row[9]).split(',').map((a: string) => a.trim()) : [],
        hostName: row[10],
        hostPhone: row[11],
        hostEmail: row[12],
        hostWhatsappNumber: row[13],
        address: row[14],
        city: row[15],
        state: row[16],
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

  it('UPLOADS ALL STAYS', () => {
    cy.wrap(stays).each((_stay: any) => {
      cy.get('input[name="_token"]').invoke('val').then((value) => {
        token = value?.toString() ?? ''
      })
      cy.visit('/stays/create')

      cy.request('POST',)
      cy.wait(10000)
    })
  })
})