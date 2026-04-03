export type TransactionStatus =
    | "new"
    | "reviewed"
    | "Flagged"
    | "Overdue";

    export interface Transaction {
        id: string;    // TXN10651
        date: string;
        amount: number;
        counterparty: string;
        source: "Bank" | "Exccel";

        //core audit fields
        evidanceCoverage: number; // 0-100
        risckScore: number; // 0-100
        status: TransactionStatus;

        //relation
        evidanceIds: string[];  // links to documments
    }