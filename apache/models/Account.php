<?php
class Account
{
    private $conn;
    private $table = 'account';

    public $account_id;
    public $account;
    public $balance;
    public $transaction_type;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                account = :account,
                transaction_type = :transaction_type';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account', $this->account);
        $stmt->bindParam(':transaction_type', $this->transaction_type);

        if($stmt->execute()){
            $this->account_id = $this->conn->lastInsertId();
            return true;
        }

        printf("Error: %s. \n", $stmt->error);
        return false;
    }

    public function read(){
        $query = 'SELECT *
          FROM 
            ' . $this->table . ' t
          ORDER BY 
            t.account,
            t.balance';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read_single(){
        $where = array();
        if (isset($this->account_id)) array_push($where, 't.account_id = :account_id');
        if (isset($this->account_id)) array_push($where, 't.account = :account');
        $where_clause = empty($where) ? '' : 'WHERE ' . implode(' AND ', $where);

        $query = 'SELECT *
          FROM
            ' . $this->table . ' t ' .
          $where_clause;

        $stmt = $this->conn->prepare($query);
        
        if (isset($this->account_id)) $stmt->bindParam(':account_id', $this->account_id);
        if (isset($this->account_id)) $stmt->bindParam(':account', $this->account_id);

        $stmt->execute();
        return $stmt;
    }
}