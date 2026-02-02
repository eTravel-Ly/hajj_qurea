import pdfMake from '@digicole/pdfmake-rtl/build/pdfmake';
import pdfFonts from '@digicole/pdfmake-rtl/build/vfs_fonts';

try {
    const vfs = pdfFonts?.pdfMake?.vfs || pdfFonts?.vfs || pdfFonts || (pdfFonts && pdfFonts.default);

    if (vfs) {
        pdfMake.vfs = vfs;

        pdfMake.fonts = {
            Nillima: {
                normal: 'Nillima.ttf',
                bold: 'Nillima.ttf',
                italics: 'Nillima.ttf',
                bolditalics: 'Nillima.ttf'
            },
            Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
            }
        };

        console.log('PDFService: pdfmake-rtl initialized successfully with fonts:', Object.keys(pdfMake.fonts));
    } else {
        console.error('PDFService: Could not initialize VFS');
    }
} catch (e) {
    console.error('PDFService: Initialization failed', e);
}
class PDFService {
    constructor() {
        this.primaryColor = '#000000';
        this.headerColor = '#F0F0F0';
    }

    /**
     * Generate PDF for lottery results with native Arabic/RTL support
     */
    async generateLotteryResultsPDF(officeData, winners, centerData = null) {
        console.log('PDFService: Generating RTL PDF for winners:', winners);

        try {
            if (!officeData) throw new Error('Office data is required');
            if (!Array.isArray(winners) || winners.length === 0) throw new Error('No winners data');

            // Fetch logo
            let logoSvg = null;
            try {
                const response = await fetch('/hajjgovly1.svg');
                if (response.ok) {
                    logoSvg = await response.text();
                }
            } catch (e) {
                console.warn('PDFService: Could not load logo', e);
            }

            const now = new Date();
            const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

            const rowsPerPage = 20;
            const totalPages = Math.ceil(winners.length / rowsPerPage);
            const regionText = centerData ? centerData.name : 'المنطقة الوسطى';

            const tableBody = [
                [
                    { text: '', style: 'tableHeader' },
                    { text: 'رقم الهاتف - 2', style: 'tableHeader' },
                    { text: 'رقم الهاتف - 1', style: 'tableHeader' },
                    { text: 'اسم المرافق', style: 'tableHeader' },
                    { text: 'الرقم الوطني/جواز', style: 'tableHeader' },
                    { text: 'اسم الحاج', style: 'tableHeader' },
                    { text: 'رقم التسجيل', style: 'tableHeader' },
                    { text: 'رقم', style: 'tableHeader' }
                ]
            ];

            winners.forEach((winner, index) => {
                tableBody.push([
                    { text: '', alignment: 'center' },
                    { text: this._getVal(winner.companionHajjPhone || winner.companionPhone2), alignment: 'center' },
                    { text: this._getVal(winner.hajjPhone || winner.companionPhone1 || winner.phone), alignment: 'center' },
                    { text: this._getVal(winner.companionHajj), alignment: 'center' },
                    { text: this._getVal(winner.hajjNid || winner.companionNationalId), alignment: 'center' },
                    { text: this._getVal(winner.hajj), alignment: 'center' },
                    { text: this._getVal(winner.registerNumber), alignment: 'center' },
                    { text: (index + 1).toString(), alignment: 'center' }
                ]);
            });

            const docDefinition = {
                pageSize: 'A4',
                pageOrientation: 'landscape',
                pageMargins: [15, 130, 15, 50],

                // Enable RTL support
                supportRTL: true,

                header: (currentPage) => {
                    const headerContent = {
                        margin: [35, 20, 35, 0],
                        columns: [
                            {
                                width: 180,
                                stack: [
                                    { text: `التاريخ: ${dateStr}`, fontSize: 9 },
                                    { text: `الوقت: ${timeStr}`, fontSize: 9, margin: [0, 2, 0, 0] },
                                    { text: `الصفحة رقم: من ${currentPage} - ${totalPages}`, fontSize: 9, margin: [0, 2, 0, 0] }
                                ],
                                alignment: 'left'
                            },
                            {
                                width: '*',
                                stack: [
                                    { text: 'الهيئة العامة لشؤون الحج والعمرة', fontSize: 26, bold: true, alignment: 'center' },
                                    { text: 'كشف حجاج القرعة', fontSize: 24, bold: true, margin: [0, 3, 0, 0], alignment: 'center' },
                                    { text: `المنطقة: ${regionText}`, fontSize: 14, bold: true, margin: [0, 5, 0, 0], alignment: 'center' }
                                ],
                                alignment: 'center'
                            },
                            {
                                width: 180,
                                alignment: 'right',
                                stack: []
                            }
                        ]
                    };

                    // Add logo if available
                    if (logoSvg) {
                        headerContent.columns[2].stack.push({
                            svg: logoSvg,
                            width: 60,
                            height: 60,
                            margin: [0, 0, 0, 5],
                            alignment: 'right'
                        });
                    }

                    headerContent.columns[2].stack.push(
                        { text: 'موسم 1447 هـ - 2026 م', fontSize: 11, bold: true, alignment: 'right' },
                        { text: regionText, fontSize: 10, margin: [0, 1, 0, 0], alignment: 'right' },
                        { text: officeData.name || '', fontSize: 10, margin: [0, 1, 0, 0], alignment: 'right' }
                    );

                    return headerContent;
                },

                content: [
                    {
                        table: {
                            headerRows: 1,
                            widths: [50, 100, '*', 120, '*', 100, 100, 50],
                            body: tableBody
                        },
                        layout: {
                            hLineWidth: () => 0.5,
                            vLineWidth: () => 0.5,
                            hLineColor: () => '#000000',
                            vLineColor: () => '#000000',
                            paddingLeft: () => 3,
                            paddingRight: () => 3,
                            paddingTop: () => 4,
                            paddingBottom: () => 4
                        }
                    },
                    {
                        margin: [20, 30, 20, 10],
                        columns: [
                            {
                                width: '50%',
                                stack: [
                                    { text: 'الاسم:......................................', fontSize: 10 },
                                    { text: 'الصفة:.....................................', fontSize: 10, margin: [0, 5, 0, 0] },
                                    { text: 'التوقيع:...................................', fontSize: 10, margin: [0, 5, 0, 0] }
                                ],
                                alignment: 'left'
                            },
                            {
                                width: '50%',
                                stack: [
                                    { text: 'الاسم:......................................', fontSize: 10 },
                                    { text: `الصفة: منسق تنسيقة ${regionText}`, fontSize: 10, margin: [0, 5, 0, 0] },
                                    { text: 'التوقيع:...................................', fontSize: 10, margin: [0, 5, 0, 0] }
                                ],
                                alignment: 'right'
                            }
                        ]
                    }
                ],

                styles: {
                    tableHeader: {
                        bold: true,
                        fontSize: 9,
                        color: 'black',
                        fillColor: '#F5F5F5',
                        alignment: 'center'
                    }
                },

                defaultStyle: {
                    font: 'Nillima',
                    fontSize: 9
                }
            };

            const fileName = `كشف_حجاج_القرعة_${officeData.name || 'المكتب'}_${new Date().getTime()}.pdf`;
            pdfMake.createPdf(docDefinition).download(fileName);

        } catch (error) {
            console.error('Error in generateLotteryResultsPDF:', error);
            throw error;
        }
    }

    // _getStatusText(status) {
    //     switch (status) {
    //         case 1: return 'في الانتظار';
    //         case 2: return 'قيد الإجراء';
    //         case 3: return 'منتهي';
    //         case 4: return 'ملغي';
    //         default: return 'لم تبدأ بعد';
    //     }
    // }

    /**
     * Helper to return "لا يوجد" if value is empty
     */
    _getVal(value) {
        if (value === null || value === undefined || value === '' || value === 'null') {
            return 'لا يوجد';
        }
        return value.toString();
    }

    generateOfficeSummaryPDF(officeData, stats = {}) {
        const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            content: [
                { text: 'الهيئة العامة لشؤون الحج والعمرة', fontSize: 16, bold: true, alignment: 'center' },
                { text: 'تقرير ملخص المكتب', fontSize: 14, bold: true, alignment: 'center', margin: [0, 10, 0, 20] },
                { text: `اسم المكتب: ${officeData.name || 'غير محدد'}`, fontSize: 12, margin: [0, 5, 0, 5] },
                { text: `الحصة الكلية: ${officeData.quota || 0}`, fontSize: 12, margin: [0, 5, 0, 5] },
                { text: `الحالة: ${this._getStatusText(officeData.status)}`, fontSize: 12, margin: [0, 5, 0, 5] }
            ],
            supportRTL: true,
            defaultStyle: { font: 'Nillima' }
        };
        pdfMake.createPdf(docDefinition).download(`تقرير_${officeData.name}.pdf`);
    }

    generateAllOfficesPDF(offices, centerData = null) {
        const tableBody = [
            [
                { text: '#', style: 'tableHeader' },
                { text: 'اسم المكتب', style: 'tableHeader' },
                { text: 'الحصة', style: 'tableHeader' },
                { text: 'المختارين', style: 'tableHeader' },
                { text: 'الحالة', style: 'tableHeader' },
                { text: 'النسبة', style: 'tableHeader' }
            ]
        ];

        offices.forEach((office, index) => {
            tableBody.push([
                { text: (index + 1).toString(), alignment: 'center' },
                { text: this._getVal(office.name), alignment: 'center' },
                { text: this._getVal(office.quota), alignment: 'center' },
                { text: this._getVal(office.selectedCount), alignment: 'center' },
                { text: this._getStatusText(office.status), alignment: 'center' },
                { text: `${Math.round((office.selectedCount / office.quota) * 100) || 0}%`, alignment: 'center' }
            ]);
        });

        const title = centerData ? `تقرير مكاتب ${centerData.name}` : 'تقرير جميع المكاتب';

        const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [15, 40, 15, 40],
            content: [
                { text: 'الهيئة العامة لشؤون الحج والعمرة', fontSize: 16, bold: true, alignment: 'center' },
                { text: title, fontSize: 14, bold: true, alignment: 'center', margin: [0, 10, 0, 20] },
                {
                    table: {
                        headerRows: 1,
                        widths: [40, '*', 80, 80, 100, 80],
                        body: tableBody
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            styles: {
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black',
                    fillColor: '#F0F0F0',
                    alignment: 'center'
                }
            },
            supportRTL: true,
            defaultStyle: { font: 'Nillima', fontSize: 10 }
        };

        const fileName = `تقرير_المكاتب_${new Date().getTime()}.pdf`;
        pdfMake.createPdf(docDefinition).download(fileName);
    }
}

export default new PDFService();
