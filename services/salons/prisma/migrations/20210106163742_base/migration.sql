-- CreateTable
CREATE TABLE "address" (
"id" SERIAL,
    "uuid" TEXT,
    "geoLocation" JSONB,
    "address" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees" (
"id" SERIAL,
    "uuid" TEXT,
    "commission" INTEGER,
    "percentFees" INTEGER,
    "statedFees" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salon" (
"id" SERIAL,
    "uuid" TEXT,
    "partnerRefs" JSONB,
    "access" JSONB,
    "type" TEXT,
    "status" TEXT,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "backgrounds" TEXT[],
    "timezone" TEXT,
    "carouselImages" TEXT[],
    "adwordsCampaignId" TEXT,
    "adwordsSync" BOOLEAN DEFAULT false,
    "email" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "companyName" TEXT,
    "salonCode" TEXT,
    "siret" TEXT,
    "iban" TEXT,
    "recommendation" TEXT,
    "dateAcceptedGcu" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addressId" INTEGER,
    "feesId" INTEGER,
    "taxId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax" (
"id" SERIAL,
    "uuid" TEXT,
    "countryCode" TEXT,
    "vatNumber" TEXT,
    "taxRate" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "salon.email_unique" ON "salon"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tax.countryCode_unique" ON "tax"("countryCode");

-- AddForeignKey
ALTER TABLE "salon" ADD FOREIGN KEY("addressId")REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salon" ADD FOREIGN KEY("feesId")REFERENCES "fees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salon" ADD FOREIGN KEY("taxId")REFERENCES "tax"("id") ON DELETE SET NULL ON UPDATE CASCADE;
