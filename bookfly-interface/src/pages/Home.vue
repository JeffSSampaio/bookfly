<template>
<Navbar/>
<UsersTable />
<BooksTable/>
<AuthorTable/>
<MovimentsTable/>
<LoanTable/>
<PenaltyTable/>
<StockBookTable/>
</template>

<script setup lang="ts">
import UsersTable from '@/components/UsersTable.vue'
import BooksTable from '@/components/BooksTable.vue'
import MovimentsTable from '@/components/MovimentsTable.vue'
import LoanTable from '@/components/LoanTable.vue'
import PenaltyTable from '@/components/PenaltyTable.vue'
import StockBookTable from '@/components/StockBookTable.vue'
import AuthorTable from '@/components/AuthorTable.vue'
import Navbar from '@/components/Navbar.vue'
</script>