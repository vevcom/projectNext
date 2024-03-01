'use client'
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import styles from './PdfDocument.module.scss';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PropTypes = {
    src: string
}

/**
 * A component that displays a PDF document in a book format
 * @param src - The path (relative to domain) to the PDF document
 */
export default function PdfDocument({ src }: PropTypes) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPages, setCurrentPages] = useState<{
            leftPage: number | null,
            rightPage: number | null
        }>({
            leftPage: null,
            rightPage: null
        });
    const [pagePair, setPagePair] = useState<number>(0);

    const onDocumentLoadSuccess = ({ numPages } : { numPages: number }) => {
        setNumPages(numPages);
    }

    useEffect(() => {
        if (!numPages) return 
        if (pagePair < 0) setPagePair(1)
        if (pagePair === 0) return setCurrentPages({
            leftPage: null,
            rightPage: numPages > 0 ? 1 : null
        })
        if (2*pagePair === numPages) return setCurrentPages({
            leftPage: numPages,
            rightPage: null
        })
        return setCurrentPages({
            leftPage: 2*pagePair,
            rightPage: 2*pagePair + 1
        })
    }, [numPages, pagePair])

    return (
        <div className={styles.PdfDocument}>
            <Document
                file={src}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <div className={styles.pages}>
                    <div className={styles.leftPage}>
                        {
                            currentPages.leftPage && (
                                <Page key={currentPages.leftPage} pageNumber={currentPages.leftPage} />
                            )
                        }
                    </div>
                    <div className={styles.rightPage}>
                        {
                            currentPages.rightPage && (
                                <Page key={currentPages.rightPage} pageNumber={currentPages.rightPage} />
                            )
                        }
                    </div>
                </div>
            </Document>
            <p>
                Page {currentPages.leftPage}, {currentPages.rightPage} of {numPages}
            </p>
            <button
                disabled={!currentPages.leftPage}
                onClick={() => setPagePair(pagePair - 1)}
            >
                Previous
            </button>
            <button
                disabled={!currentPages.rightPage}
                onClick={() => setPagePair(pagePair + 1)}
            >
                Next
            </button>
        </div>
    )
}