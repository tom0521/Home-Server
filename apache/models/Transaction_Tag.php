<?php
class Transaction_Tag
{
    private $conn;
    private $table = 'transaction_tag';

    public $transaction_id;
    public $tag_id;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                transaction_id = :transaction_id,
                tag_id = :tag_id';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':transaction_id', $this->transaction_id);
        $stmt->bindParam(':tag_id', $this->tag_id);

        if($stmt->execute()){
            return true;
        }

        printf("Error: %s. \n", $stmt->error);
        return false;
    }

    public function read_tag() {
        $query = 'SELECT *
        FROM
            tag t1
        WHERE
            t1.tag_id IN
        (SELECT transaction_id
            FROM
                ' . $this->table . ' t2
            WHERE
                t2.tag_id = :tag_id
            ORDER BY
                t2.transaction_id)';
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':tag_id', $this->tag_id);
        $stmt->execute();
        return $stmt;
    }
}